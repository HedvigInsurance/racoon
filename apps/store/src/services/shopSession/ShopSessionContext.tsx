import { useApolloClient } from '@apollo/client'
import { createContext, PropsWithChildren, useContext, useEffect, useMemo } from 'react'
import { ShopSessionQueryResult, useShopSessionQuery } from '@/services/apollo/generated'
import { ShopSession } from '@/services/shopSession/ShopSession.types'
import { Track } from '@/services/Track/Track'
import { isBrowser } from '@/utils/env'
import { useCurrentCountry } from '@/utils/l10n/useCurrentCountry'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'
import { setupShopSessionServiceClientSide } from './ShopSession.helpers'

export const ShopSessionContext = createContext<ShopSessionQueryResult | null>(null)

type Props = PropsWithChildren<{ shopSession?: ShopSession }>

export const ShopSessionProvider = ({ children, shopSession: initialShopSession }: Props) => {
  const contextValue = useShopSessionContextValue(initialShopSession)

  const shopSessionId = contextValue?.data?.shopSession.id
  useEffect(() => {
    Track.addContext('shopSessionId', shopSessionId)
  }, [shopSessionId])

  return <ShopSessionContext.Provider value={contextValue}>{children}</ShopSessionContext.Provider>
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

const useShopSessionContextValue = (initialShopSession?: ShopSession) => {
  const { countryCode } = useCurrentCountry()
  const { locale } = useCurrentLocale()
  const apolloClient = useApolloClient()
  const shopSessionService = useMemo(
    () => setupShopSessionServiceClientSide(apolloClient),
    [apolloClient],
  )
  const shopSessionId = shopSessionService.shopSessionId() ?? initialShopSession?.id

  const queryResult = useShopSessionQuery({
    variables: shopSessionId ? { shopSessionId, locale } : undefined,
    ssr: false,
    skip: !shopSessionId,
  })

  useEffect(() => {
    if (isBrowser()) {
      if (initialShopSession && shopSessionService.shopSessionId() !== initialShopSession.id) {
        shopSessionService.saveId(initialShopSession.id)
      }
    }
  }, [initialShopSession, shopSessionService])

  useEffect(() => {
    if (isBrowser()) {
      shopSessionService.getOrCreate({ locale, countryCode })
    }
  }, [countryCode, locale, shopSessionService])

  return useMemo(() => {
    if (isBrowser()) {
      // Client: we always have a session, sometimes there's loading state
      return queryResult
    } else if (initialShopSession) {
      // SSR with session
      return { ...queryResult, data: { shopSession: initialShopSession } }
    } else {
      // SSG or SSR without session - we don't have data and won't start loading until client side takes over
      return queryResult
    }
  }, [initialShopSession, queryResult])
}
