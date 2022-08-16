import { QueryHookOptions, QueryResult, useApolloClient } from '@apollo/client'
import { createContext, PropsWithChildren, useContext, useEffect } from 'react'
import { useCurrentLocale } from '@/lib/l10n/useCurrentLocale'
import {
  ShopSessionCreateMutation,
  ShopSessionQuery,
  ShopSessionQueryVariables,
  useShopSessionCreateMutation,
  useShopSessionQuery as useShopSessionApolloQuery,
} from '@/services/apollo/generated'
import { setupShopSessionServiceClientSide } from './ShopSession.helpers'

type ShopSessionQueryResult = QueryResult<ShopSessionQuery, ShopSessionQueryVariables>

export const ShopSessionContext = createContext<ShopSessionQueryResult | null>(null)

export const ShopSessionProvider = ({ children }: PropsWithChildren<unknown>) => {
  const { countryCode } = useCurrentLocale()
  const shopSessionService = useShopSessionService()
  const shopSessionId = shopSessionService.shopSessionId()

  const [createShopSession, mutationResult] = useCreateShopSession({
    onCompleted: ({ shopSessionCreate }) => {
      shopSessionService.save(shopSessionCreate)
    },
  })

  const queryResult = useShopSessionQuery({
    shopSessionId,
    onCompleted: ({ shopSession }) => {
      if (shopSession.countryCode !== countryCode) {
        console.warn('ShopSession CountryCode does not match')
        createShopSession()
      }
    },
    onError: (error) => {
      console.warn('ShopSession not found: ', shopSessionId, error)
      createShopSession()
    },
  })

  // const shopSessionCountryCode = result.data?.shopSession?.countryCode
  // FIXME: Ensure we don't return incorrect country data.  Perhaps remove session from apolloCache
  // shopSession: shopSessionCountryCode !== countryCode ? null : result.data?.shopSession ?? null,

  // Has to be wrapped to prevent duplicate execution (Apollo quirk leads do duplicate execution when called directly from render)
  useEffect(() => {
    // TODO: isBrowser() and ensure code splitting does not break
    if (typeof window !== 'undefined' && !shopSessionId && !mutationResult.called) {
      createShopSession()
    }
  }, [createShopSession, mutationResult.called, shopSessionId])

  return <ShopSessionContext.Provider value={queryResult}>{children}</ShopSessionContext.Provider>
}

export const useShopSession = () => {
  const queryResult = useContext(ShopSessionContext)
  if (!queryResult) {
    throw new Error(
      'useShopSession called from outside ShopSessionContextProvider, no value in context',
    )
  }
  return queryResult
}

const useCreateShopSession = ({ onCompleted }: ShopSessionOperationParams) => {
  const { countryCode } = useCurrentLocale()
  return useShopSessionCreateMutation({
    variables: { countryCode },
    onCompleted,
  })
}

type ShopSessionOperationParams = {
  onCompleted: (data: ShopSessionCreateMutation) => void
}

const useShopSessionQuery = ({ shopSessionId, ...rest }: UseShopSessionParams) => {
  return useShopSessionApolloQuery({
    variables: shopSessionId ? { shopSessionId } : undefined,
    skip: !shopSessionId,
    // Only intended to run client-side, prefetch and pass to Apollo Cache if fetched on server.
    ssr: false,
    ...rest,
  })
}

type ShopSessionQueryHookOption = QueryHookOptions<ShopSessionQuery, ShopSessionQueryVariables>
type UseShopSessionParams = Omit<ShopSessionQueryHookOption, 'variables'> & {
  shopSessionId: string | null
}

const useShopSessionService = () => {
  const apolloClient = useApolloClient()
  return setupShopSessionServiceClientSide(apolloClient)
}
