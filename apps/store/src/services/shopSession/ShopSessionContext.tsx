import { Observable, useApolloClient } from '@apollo/client'
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { SubscriptionObserver } from 'zen-observable-ts'
import { ShopSessionQueryResult, useShopSessionQuery } from '@/services/apollo/generated'
import { ShopSession } from '@/services/shopSession/ShopSession.types'
import { isBrowser } from '@/utils/env'
import { useCurrentCountry } from '@/utils/l10n/useCurrentCountry'
import { setupShopSessionServiceClientSide } from './ShopSession.helpers'

type OnReadyCallback = (shopSession: ShopSession) => unknown

type ShopSessionResult = ShopSessionQueryResult & {
  shopSession?: ShopSession
  onReady: (callback: OnReadyCallback) => () => void
}

export const ShopSessionContext = createContext<ShopSessionResult | null>(null)

type Props = PropsWithChildren<{ shopSessionId?: string }>

export const ShopSessionProvider = ({ children, shopSessionId: initialShopSessionId }: Props) => {
  const contextValue = useShopSessionContextValue(initialShopSessionId)
  return <ShopSessionContext.Provider value={contextValue}>{children}</ShopSessionContext.Provider>
}

export const useShopSession = (): ShopSessionResult => {
  const queryResult = useContext(ShopSessionContext)
  if (!queryResult) {
    throw new Error(
      'useShopSession called from outside ShopSessionContextProvider, no value in context',
    )
  }
  return queryResult
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
    variables: shopSessionId ? { shopSessionId } : undefined,
    skip: !shopSessionId,
  }) as ShopSessionResult

  // GOTCHA: We cannot use queryResult.observable directly with skipped query since it changes
  // when query becomes un-skipped.  Probably an Apollo Client bug
  const readyRef = useRef<{
    observable: Observable<ShopSession>
    observer?: SubscriptionObserver<ShopSession>
  }>()
  if (readyRef.current == null) {
    const observable = new Observable<ShopSession>((subscriptionObserver) => {
      if (readyRef.current) readyRef.current.observer = subscriptionObserver
    })
    readyRef.current = {
      observable,
    }
  }

  // Fetch client-side, service ensures it only happens once
  useEffect(() => {
    if (isBrowser()) {
      shopSessionServiceClientSide.getOrCreate({ countryCode }).then((shopSession) => {
        setShopSessionId(shopSession.id)
        readyRef.current?.observer?.next(shopSession)
      })
    }
  }, [shopSessionServiceClientSide, countryCode])

  // TODO: Move country check elsewhere, make sure we do full reload (GRW-1985)
  // Ignore session from different country.
  // This probably means old session was fetched and new one is being created
  const shopSession = queryResult.data?.shopSession
  queryResult.shopSession = shopSession?.countryCode === countryCode ? shopSession : undefined

  if (!queryResult.onReady) {
    queryResult.onReady = (callback) => {
      const subscription = readyRef.current?.observable.subscribe(callback)
      return () => subscription?.unsubscribe()
    }
  }

  return queryResult
}
