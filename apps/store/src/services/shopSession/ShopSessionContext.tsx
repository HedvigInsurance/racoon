'use client'

import { useApolloClient } from '@apollo/client'
import type { PropsWithChildren } from 'react'
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { ShopSessionQueryResult } from '@/services/graphql/generated'
import { useShopSessionQuery } from '@/services/graphql/generated'
import type { ShopSession } from '@/services/shopSession/ShopSession.types'
import { isBrowser } from '@/utils/env'
import { useCurrentCountry } from '@/utils/l10n/useCurrentCountry'
import { setupShopSessionServiceClientSide } from './ShopSession.helpers'

type OnReadyCallback = (shopSession: ShopSession) => unknown

type ShopSessionResult = ShopSessionQueryResult & {
  shopSession?: ShopSession
  onReady: (callback: OnReadyCallback) => () => void
  reset: () => Promise<void>
}

export const ShopSessionContext = createContext<ShopSessionResult | null>(null)
ShopSessionContext.displayName = 'ShopSessionContext'

type Props = PropsWithChildren<{ shopSessionId?: string }>

export const ShopSessionProvider = ({ children, shopSessionId: initialShopSessionId }: Props) => {
  const contextValue = useShopSessionContextValue(initialShopSessionId)
  return (
    <ShopSessionContext.Provider value={contextValue}>
      <ShopSessionIdContext.Provider value={contextValue.shopSession?.id ?? null}>
        {children}
      </ShopSessionIdContext.Provider>
    </ShopSessionContext.Provider>
  )
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

export const useShopSessionValueOrThrow = (): ShopSession => {
  const { shopSession } = useShopSession()
  if (shopSession == null) {
    throw new Error('shopSession cannot be null')
  }
  return shopSession
}

const useShopSessionContextValue = (initialShopSessionId?: string) => {
  const { countryCode } = useCurrentCountry()

  const apolloClient = useApolloClient()
  const shopSessionServiceClientSide = useMemo(
    () => setupShopSessionServiceClientSide(apolloClient),
    [apolloClient],
  )

  const [shopSessionId, setShopSessionId] = useState(
    initialShopSessionId ?? shopSessionServiceClientSide.shopSessionId(),
  )

  const queryResult = useShopSessionQuery({
    variables: shopSessionId ? { shopSessionId } : undefined,
    skip: !shopSessionId,
  }) as ShopSessionResult

  // GOTCHA: We cannot use queryResult.observable directly with skipped query since it changes
  // when query becomes un-skipped.  Hence, we have this analog of RxJS.Subject
  const callbacksRef = useRef(new Set<OnReadyCallback>())
  queryResult.onReady = useCallback(
    (callback) => {
      const shopSession = queryResult.shopSession
      if (shopSession) {
        // Prevent duplicate invocations in dev mode
        setTimeout(() => {
          if (callbacksRef.current.has(callback)) {
            try {
              callback(shopSession)
            } finally {
              callbacksRef.current.delete(callback)
            }
          }
        })
      }
      callbacksRef.current.add(callback)
      return () => callbacksRef.current.delete(callback)
    },
    [queryResult.shopSession],
  )

  queryResult.reset = useCallback(() => {
    shopSessionServiceClientSide.reset()
    return shopSessionServiceClientSide.getOrCreate({ countryCode }).then((shopSession) => {
      setShopSessionId(shopSession.id)
    })
  }, [countryCode, shopSessionServiceClientSide])

  // Fetch client-side, service ensures it only happens once
  useEffect(() => {
    // We want to make sure the shopSession returned by this hook is:
    // 1. The one which is `initialShopSessionId`, when it's provided
    // 2. The one which its id is stored in the cookie, when `initialShopSessionId` is not provided
    if (isBrowser() && initialShopSessionId == null) {
      shopSessionServiceClientSide.getOrCreate({ countryCode }).then((shopSession) => {
        setShopSessionId(shopSession.id)
        try {
          callbacksRef.current.forEach((callback) => callback(shopSession))
        } finally {
          callbacksRef.current.clear()
        }
      })
    }
  }, [shopSessionServiceClientSide, countryCode, initialShopSessionId])

  // TODO: Move country check elsewhere, make sure we do full reload (GRW-1985)
  // Ignore session from different country.
  // This probably means old session was fetched and new one is being created
  const shopSession = queryResult.data?.shopSession
  queryResult.shopSession = shopSession?.countryCode === countryCode ? shopSession : undefined

  return queryResult
}

// Optimization: single-field context that allows consuming just sessionId
// Unlike full ShopSessionContext, almost never triggers rerender since ID rarely changes
export const ShopSessionIdContext = createContext<string | null>(null)
ShopSessionIdContext.displayName = 'ShopSessionIdContext'

export const useShopSessionId = (): string | null => {
  return useContext(ShopSessionIdContext)
}

export const useShopSessionIdOrThrow = (): string => {
  const value = useContext(ShopSessionIdContext)
  if (value == null) {
    throw new Error('shopSessionId cannot be null')
  }
  return value
}
