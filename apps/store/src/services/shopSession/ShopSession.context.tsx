import { QueryResult, ServerError, useApolloClient } from '@apollo/client'
import { ReactNode, createContext, useMemo, useRef } from 'react'
import { useCurrentLocale } from '@/lib/l10n/useCurrentLocale'
import {
  useShopSessionCreateMutation,
  useShopSessionQuery as useShopSessionApolloQuery,
} from '@/services/apollo/generated'
import { ShopSessionQuery, ShopSessionQueryVariables } from '../graphql/generated'
import { setupShopSessionServiceClientSide } from './ShopSession.helpers'

export function ShopSessionContextProvider({ children }: { children: ReactNode }) {
  const { value } = useShopSessionContextProvider()
  return <ShopSessionContext.Provider value={value}>{children}</ShopSessionContext.Provider>
}

type ShopSessionQueryResult = QueryResult<ShopSessionQuery, ShopSessionQueryVariables>
type ShopSessionContextValue = {
  querySession: () => ShopSessionQueryResult
}
// FIXME: Move to custom App component
export const ShopSessionContext = createContext<ShopSessionContextValue | null>(null)

function useShopSessionContextProvider() {
  const resultRef = useRef<{
    called: boolean
    value: ShopSessionContextValue
    result?: ShopSessionQueryResult
  }>({
    called: false,
    value: null as unknown as ShopSessionContextValue, // Sync initialized before return
  })

  const { countryCode } = useCurrentLocale()
  const shopSessionService = useShopSessionService()

  const [createShopSession] = useShopSessionCreateMutation({
    variables: { countryCode },
    onCompleted({ shopSessionCreate }) {
      shopSessionService.save(shopSessionCreate)
    },
  })

  const shopSessionId = shopSessionService.shopSessionId()

  const queryResult = useShopSessionApolloQuery({
    variables: shopSessionId ? { shopSessionId } : undefined,
    skip: !shopSessionId,
    onCompleted: ({ shopSession }) => {
      if (shopSession.countryCode !== countryCode) {
        createShopSession()
      }
    },
    onError(error) {
      if ((error.networkError as ServerError)?.statusCode === 404) {
        createShopSession()
      }
    },
  })

  const contextValue = useMemo(
    () => ({
      // Lazy so that we don't create session until it's first needed
      querySession() {
        if (resultRef.current.result != null) {
          resultRef.current.result = queryResult
          if (!shopSessionService.shopSessionId()) {
            // setTimeout avoids update loops when rendering
            setTimeout(() => createShopSession())
          }
        }
        return resultRef.current.result
      },
    }),
    [queryResult, createShopSession, shopSessionService],
  )

  Object.assign(resultRef.current, {
    value: contextValue,
  })
  return resultRef.current
}

const useShopSessionService = () => {
  const apolloClient = useApolloClient()
  return setupShopSessionServiceClientSide(apolloClient)
}
