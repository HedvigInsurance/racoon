import { useApolloClient } from '@apollo/client'
import { createContext, PropsWithChildren, useContext, useEffect, useMemo } from 'react'
import { ShopSessionQueryResult, useShopSessionQuery } from '@/services/apollo/generated'
import { isBrowser } from '@/utils/env'
import { useCurrentCountry } from '@/utils/l10n/useCurrentCountry'
import { setupShopSessionServiceClientSide } from './ShopSession.helpers'

export const ShopSessionContext = createContext<ShopSessionQueryResult | null>(null)

type Props = PropsWithChildren<{ shopSessionId?: string }>

export const ShopSessionProvider = ({ children, shopSessionId: initialShopSessionId }: Props) => {
  const contextValue = useShopSessionContextValue(initialShopSessionId)
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

const useShopSessionContextValue = (initialShopSessionId?: string) => {
  const { countryCode } = useCurrentCountry()
  const apolloClient = useApolloClient()
  // Only used client-side
  const shopSessionService = useMemo(
    () => setupShopSessionServiceClientSide(apolloClient),
    [apolloClient],
  )
  const shopSessionId = shopSessionService.shopSessionId() ?? initialShopSessionId

  const queryResult = useShopSessionQuery({
    variables: shopSessionId ? { shopSessionId } : undefined,
    skip: !shopSessionId,
  })

  useEffect(() => {
    if (isBrowser()) {
      shopSessionService.getOrCreate({ countryCode })
    }
  }, [countryCode, shopSessionService])

  return queryResult
}
