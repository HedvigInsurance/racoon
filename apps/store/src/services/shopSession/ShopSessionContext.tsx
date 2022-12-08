import { useApolloClient } from '@apollo/client'
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react'
import { ShopSession } from '@/services/shopSession/ShopSession.types'
import { ShopSessionService } from '@/services/shopSession/ShopSessionService'
import { isBrowser } from '@/utils/isBrowser'
import { useCurrentCountry } from '@/utils/l10n/useCurrentCountry'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'
import { setupShopSessionServiceClientSide } from './ShopSession.helpers'

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

type Props = PropsWithChildren<{ shopSessionId?: string }>

export const ShopSessionProvider = ({ children, shopSessionId: initialShopSessionId }: Props) => {
  const { countryCode } = useCurrentCountry()
  const { locale } = useCurrentLocale()
  const shopSessionService = useShopSessionService()
  const [contextValue, setContextValue] = useState<ShopSessionContext>(defaultContextValue)

  useEffect(() => {
    if (isBrowser() && initialShopSessionId) {
      shopSessionService.save(initialShopSessionId)
    }
  }, [initialShopSessionId, shopSessionService])

  useEffect(() => {
    ;(async () => {
      if (!isBrowser()) return
      try {
        setContextValue(defaultContextValue)
        const shopSession = await shopSessionService.getOrCreate({ locale, countryCode })
        setContextValue({ shopSession, state: ShopSessionState.Success })
      } catch (err) {
        setContextValue({ state: ShopSessionState.Error })
      }
    })()
  }, [shopSessionService, locale, countryCode])

  return <ShopSessionContext.Provider value={contextValue}>{children}</ShopSessionContext.Provider>
}

export const useShopSession = () => {
  return useContext(ShopSessionContext)
}

// TODO: Make creation explicit in App
let shopSessionService: ShopSessionService
const useShopSessionService = () => {
  const apolloClient = useApolloClient()
  if (isBrowser() && !shopSessionService) {
    shopSessionService = setupShopSessionServiceClientSide(apolloClient)
  }
  return shopSessionService
}
