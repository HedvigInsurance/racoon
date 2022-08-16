import { QueryHookOptions, QueryResult, useApolloClient } from '@apollo/client'
import { createContext, PropsWithChildren, useContext, useEffect } from 'react'
import { useCurrentLocale } from '@/lib/l10n/useCurrentLocale'
import {
  Exact,
  ShopSessionCreateMutation,
  ShopSessionQuery,
  ShopSessionQueryVariables,
  useShopSessionCreateMutation,
  useShopSessionQuery as useShopSessionApolloQuery,
} from '@/services/apollo/generated'
import { setupShopSessionServiceClientSide } from './ShopSession.helpers'

type ShopSessionQueryResult = QueryResult<ShopSessionQuery, ShopSessionQueryVariables>

export const ShopSessionContext = createContext<ShopSessionQueryResult | null>(null)

export const ShopSessionProvider = ({
  children,
  initialShopSessionId = null,
}: PropsWithChildren<{ initialShopSessionId: string | null }>) => {
  const { countryCode } = useCurrentLocale()
  const shopSessionService = useShopSessionService()
  // NOTE: initialShopSessionId is used on server side where we don't have access to shopSessionService deep in react tree
  const shopSessionId = shopSessionService.shopSessionId() || initialShopSessionId

  const [createShopSession, mutationResult] = useCreateShopSession({
    onCompleted: ({ shopSessionCreate }) => {
      shopSessionService.save(shopSessionCreate)
    },
  })

  const queryResult = useShopSessionQuery({
    shopSessionId,
    onCompleted: ({ shopSession }) => {
      // FIXME: Check for duplicate client fetch if this runs on the server
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

  // Has to be wrapped to prevent duplicate execution (Apollo)
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
    ssr: false,
    ...rest,
  })
}

type UseShopSessionParams = {
  shopSessionId: string | null
} & Omit<QueryHookOptions<ShopSessionQuery, Exact<{ shopSessionId: string }>>, 'variables'>

const useShopSessionService = () => {
  const apolloClient = useApolloClient()
  return setupShopSessionServiceClientSide(apolloClient)
}
