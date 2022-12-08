import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react'
import { useShopSessionLazyQuery } from '@/services/apollo/generated'
import { ShopSession } from '@/services/shopSession/ShopSession.types'
import { ShopSessionService } from '@/services/shopSession/ShopSessionService'
import { isBrowser } from '@/utils/isBrowser'
import { useCurrentCountry } from '@/utils/l10n/useCurrentCountry'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'

export enum ShopSessionState {
  Loading = 'Loading',
  Success = 'Success',
  Error = 'Error',
}

type ShopSessionContext = {
  shopSession?: ShopSession
  state: ShopSessionState
}
const defaultContextValue = {
  state: ShopSessionState.Loading,
}

export const ShopSessionContext = createContext<ShopSessionContext>(defaultContextValue)

type Props = PropsWithChildren<{ shopSessionService?: ShopSessionService; shopSessionId?: string }>

export const ShopSessionProvider = ({
  children,
  shopSessionId: initialShopSessionId,
  shopSessionService,
}: Props) => {
  const { countryCode } = useCurrentCountry()
  const { locale } = useCurrentLocale()
  const [state, setState] = useState(ShopSessionState.Loading)

  if (isBrowser() && !shopSessionService) {
    throw new Error('shopSessionService must be provided in browser environment')
  }

  useEffect(() => {
    if (isBrowser() && initialShopSessionId) {
      shopSessionService!.save(initialShopSessionId)
    }
  }, [initialShopSessionId, shopSessionService])

  // Using query to subscribe to further updates
  // It should not fetch because we're launching if after session is already in cache
  const [loadShopSession, queryResult] = useShopSessionLazyQuery({
    ssr: false,
  })

  useEffect(() => {
    ;(async () => {
      if (!isBrowser()) return
      try {
        setState(ShopSessionState.Loading)
        const shopSession = await shopSessionService!.getOrCreate({ locale, countryCode })
        loadShopSession({
          variables: { shopSessionId: shopSession.id, locale },
          onCompleted() {
            setState(ShopSessionState.Success)
          },
        })
      } catch (err) {
        setState(ShopSessionState.Error)
      }
    })()
  }, [shopSessionService, locale, countryCode, loadShopSession])

  const contextValue = useMemo(
    () => ({
      state,
      shopSession: queryResult.data?.shopSession,
    }),
    [state, queryResult.data],
  )

  return <ShopSessionContext.Provider value={contextValue}>{children}</ShopSessionContext.Provider>
}

export const useShopSession = () => {
  return useContext(ShopSessionContext)
}
