import { createContext, ProviderProps, useEffect } from 'react'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { Tracking, TrackingContextKey } from '@/services/Tracking/Tracking'

export const TrackingContext = createContext(new Tracking())

export const TrackingProvider = ({ value: tracking, children }: ProviderProps<Tracking>) => {
  useTrackShopSession(tracking)

  return <TrackingContext.Provider value={tracking}>{children}</TrackingContext.Provider>
}

export const useTrackShopSession = (tracking: Tracking) => {
  const { onReady } = useShopSession()
  useEffect(() => {
    return onReady((shopSession) => {
      tracking.setContext(TrackingContextKey.ShopSessionId, shopSession.id)
    })
  }, [onReady, tracking])
}
