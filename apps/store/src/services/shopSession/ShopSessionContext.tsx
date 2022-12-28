import { useApolloClient } from '@apollo/client'
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { ShopSessionQueryResult, useShopSessionQuery } from '@/services/apollo/generated'
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

  // TODO: Move country check elsewhere, make sure we do full reload (GRW-1985)
  // Ignore session from different country.
  // This probably means old session was fetched and new one is being created
  const shopSession = queryResult.data?.shopSession
  result.current.shopSession = shopSession?.countryCode === countryCode ? shopSession : undefined

  return result.current
}

const useShopSessionContextValue = (initialShopSessionId?: string) => {
  const { countryCode } = useCurrentCountry()
  const apolloClient = useApolloClient()
  const shopSessionServiceClientSide = useMemo(
    () => setupShopSessionServiceClientSide(apolloClient),
    [apolloClient],
  )

  const [shopSessionId, setShopSessionId] = useState(
    shopSessionServiceClientSide.shopSessionId() ?? initialShopSessionId,
  )

  const queryResult = useShopSessionQuery({
    ssr: true,
    variables: shopSessionId ? { shopSessionId } : undefined,
    skip: !shopSessionId,
  })

  // Fetch client-side, service ensures it only happens once
  useEffect(() => {
    if (isBrowser()) {
      shopSessionServiceClientSide.getOrCreate({ countryCode }).then((shopSession) => {
        setShopSessionId(shopSession.id)
      })
    }
  }, [shopSessionServiceClientSide, countryCode])

  return queryResult
}
