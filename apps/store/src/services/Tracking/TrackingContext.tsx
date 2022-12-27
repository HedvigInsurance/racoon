import { createContext, ProviderProps, useEffect } from 'react'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { Tracking } from '@/services/Tracking/Tracking'

export const TrackingContext = createContext(new Tracking())

export const TrackingProvider = ({ value: tracking, children }: ProviderProps<Tracking>) => {
  useTrackShopSession(tracking)

  return <TrackingContext.Provider value={tracking}>{children}</TrackingContext.Provider>
}

export const useTrackShopSession = (tracking: Tracking) => {
  const { shopSession } = useShopSession()
  const shopSessionId = shopSession?.id
  useEffect(() => {
    if (shopSessionId) {
      tracking.setContext('shopSessionId', shopSessionId)
    }
  }, [shopSessionId, tracking])
}
