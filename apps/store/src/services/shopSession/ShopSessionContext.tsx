import { useApolloClient } from '@apollo/client'
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useRef } from 'react'
import { ShopSessionQueryResult, useShopSessionLazyQuery } from '@/services/apollo/generated'
import { ShopSession } from '@/services/shopSession/ShopSession.types'
import { isBrowser } from '@/utils/env'
import { useCurrentCountry } from '@/utils/l10n/useCurrentCountry'
import { setupShopSessionServiceClientSide } from './ShopSession.helpers'

export const ShopSessionContext = createContext<ShopSessionQueryResult | null>(null)

type Props = PropsWithChildren<{ shopSessionId?: string }>

export const ShopSessionProvider = ({ children, shopSessionId: initialShopSessionId }: Props) => {
  const contextValue = useShopSessionContextValue(initialShopSessionId)
  return <ShopSessionContext.Provider value={contextValue}>{children}</ShopSessionContext.Provider>
}

type ShopSessionResult = ShopSessionQueryResult & { shopSession?: ShopSession }

export const useShopSession = (): ShopSessionResult => {
  const { countryCode } = useCurrentCountry()

  const queryResult = useContext(ShopSessionContext)
  if (!queryResult) {
    throw new Error(
      'useShopSession called from outside ShopSessionContextProvider, no value in context',
    )
  }

  // Make sure result object is stable
  const result = useRef<ShopSessionResult>({} as ShopSessionResult)

  // Ignore session from different country.
  // This probably means old session was fetched and new one is being created
  const shopSession = queryResult.data?.shopSession
  result.current.shopSession = shopSession?.countryCode === countryCode ? shopSession : undefined

  return result.current
}

const useShopSessionContextValue = (initialShopSessionId?: string) => {
  const { countryCode } = useCurrentCountry()
  const apolloClient = useApolloClient()
  // Only used client-side
  const shopSessionServiceClientSide = useMemo(
    () => setupShopSessionServiceClientSide(apolloClient),
    [apolloClient],
  )

  const [fetchSession, queryResult] = useShopSessionLazyQuery({
    // Prevent network requests and ensure we trigger an error on cache miss, which should never happen
    fetchPolicy: 'cache-only',
  })

  // Fetch client-side, service ensures it only happens once
  useEffect(() => {
    if (isBrowser()) {
      shopSessionServiceClientSide.getOrCreate({ countryCode }).then((shopSession) => {
        fetchSession({
          variables: { shopSessionId: shopSession.id },
        })
      })
    }
  }, [shopSessionServiceClientSide, countryCode, fetchSession])

  // Fetch once during SSR
  if (!isBrowser() && initialShopSessionId && !queryResult.called) {
    fetchSession({ variables: { shopSessionId: initialShopSessionId } })
  }

  return queryResult
}
