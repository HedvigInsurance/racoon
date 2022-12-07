import { QueryResult, useApolloClient } from '@apollo/client'
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useRef } from 'react'
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
  const calledRef = useRef(false)

  const [createShopSession] = useShopSessionCreateMutation({
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

  useEffect(() => {
    // calledRef ensures we don't call the effect twice in strict mode
    // TODO: isBrowser() and ensure code splitting does not break
    if (typeof window !== 'undefined' && !shopSessionId && !calledRef.current) {
      calledRef.current = true
      createShopSession()
    }
  }, [createShopSession, shopSessionId])

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
