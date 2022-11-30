import { QueryResult, useApolloClient } from '@apollo/client'
import { createContext, PropsWithChildren, useContext, useEffect, useMemo } from 'react'
import {
  ShopSessionQuery,
  ShopSessionQueryVariables,
  useShopSessionCreateMutation,
  useShopSessionQuery as useShopSessionApolloQuery,
} from '@/services/apollo/generated'
import { Track } from '@/services/Track/Track'
import { useCurrentCountry } from '@/utils/l10n/useCurrentCountry'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'
import { setupShopSessionServiceClientSide } from './ShopSession.helpers'

type ShopSessionQueryResult = QueryResult<ShopSessionQuery, ShopSessionQueryVariables>

export const ShopSessionContext = createContext<ShopSessionQueryResult | null>(null)

type Props = PropsWithChildren<{ shopSessionId?: string }>

export const ShopSessionProvider = ({ children, shopSessionId: initialShopSessionId }: Props) => {
  const { countryCode } = useCurrentCountry()
  const { locale } = useCurrentLocale()
  const shopSessionService = useShopSessionService()
  const shopSessionId = initialShopSessionId ?? shopSessionService.shopSessionId()

  const [createShopSession, mutationResult] = useShopSessionCreateMutation({
    variables: { countryCode, locale },
    onCompleted: ({ shopSessionCreate }) => {
      shopSessionService.save(shopSessionCreate)
    },
  })

  const queryResult = useShopSessionApolloQuery({
    variables: shopSessionId ? { shopSessionId, locale } : undefined,
    skip: !shopSessionId,
    ssr: typeof window === 'undefined',
    onCompleted: ({ shopSession }) => {
      Track.addContext('shopSessionId', shopSession.id)
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
  const { countryCode } = useCurrentCountry()

  const queryResult = useContext(ShopSessionContext)
  if (!queryResult) {
    throw new Error(
      'useShopSession called from outside ShopSessionContextProvider, no value in context',
    )
  }

  return useMemo(() => {
    const shopSession = queryResult.data?.shopSession
    return {
      ...queryResult,
      // Ignore session from different country.
      // This probably means old session was fetched and new one is being created
      shopSession: shopSession?.countryCode === countryCode ? shopSession : undefined,
    }
  }, [queryResult, countryCode])
}

const useShopSessionService = () => {
  const apolloClient = useApolloClient()
  return setupShopSessionServiceClientSide(apolloClient)
}
