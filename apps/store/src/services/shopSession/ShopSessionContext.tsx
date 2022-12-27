import { createContext, PropsWithChildren, useContext, useRef } from 'react'
import { ShopSessionQueryResult, useShopSessionQuery } from '@/services/apollo/generated'
import { ShopSession } from '@/services/shopSession/ShopSession.types'
import { isBrowser } from '@/utils/env'
import { useCurrentCountry } from '@/utils/l10n/useCurrentCountry'

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
  const queryResult = useShopSessionQuery({
    // Prevent network requests and ensure we trigger an error on cache miss, which should never happen
    variables: initialShopSessionId ? { shopSessionId: initialShopSessionId } : undefined,
    skip: !initialShopSessionId,
    fetchPolicy: 'cache-only',
    ssr: !isBrowser(),
  })

  return queryResult
}
