import { QueryHookOptions, QueryResult, useApolloClient } from '@apollo/client'
import { createContext, PropsWithChildren, useContext, useEffect } from 'react'
import { useCurrentMarket } from '@/lib/l10n/useCurrentMarket'
import {
  ShopSessionQuery,
  ShopSessionQueryVariables,
  useShopSessionCreateMutation,
  useShopSessionQuery as useShopSessionApolloQuery,
} from '@/services/apollo/generated'
import { setupShopSessionServiceClientSide } from './ShopSession.helpers'

type ShopSessionQueryResult = QueryResult<ShopSessionQuery, ShopSessionQueryVariables>

export const ShopSessionContext = createContext<ShopSessionQueryResult | null>(null)

type Props = PropsWithChildren<{ shopSessionId?: string }>

export const ShopSessionProvider = ({ children, shopSessionId: initialShopSessionId }: Props) => {
  const { countryCode } = useCurrentMarket()
  const shopSessionService = useShopSessionService()
  const shopSessionId = initialShopSessionId ?? shopSessionService.shopSessionId()

  const [createShopSession, mutationResult] = useShopSessionCreateMutation({
    variables: { countryCode },
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
    ssr: typeof window === 'undefined',
  })

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
  const { countryCode } = useCurrentMarket()

  const queryResult = useContext(ShopSessionContext)
  if (!queryResult) {
    throw new Error(
      'useShopSession called from outside ShopSessionContextProvider, no value in context',
    )
  }

  const { data, ...other } = queryResult

  let shopSession = data?.shopSession
  if (shopSession?.countryCode !== countryCode) {
    // Ignore session from different country.  This probably means old session was fetched and new one is being created
    shopSession = undefined
  }
  return {
    ...other,
    shopSession,
  }
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
