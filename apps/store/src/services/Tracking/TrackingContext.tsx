import { useRouter } from 'next/router'
import { createContext, ProviderProps, useEffect } from 'react'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { Tracking } from '@/services/Tracking/Tracking'

export const TrackingContext = createContext(new Tracking())

export const TrackingProvider = ({ value: tracking, children }: ProviderProps<Tracking>) => {
  useTrackPageViews(tracking)
  useTrackShopSession(tracking)

  return <TrackingContext.Provider value={tracking}>{children}</TrackingContext.Provider>
}

const useTrackPageViews = (tracking: Tracking) => {
  const router = useRouter()
  useEffect(() => {
    const handleRouteChange = (url: string, { shallow = false } = {}) => {
      if (!shallow) {
        tracking.reportPageView(url)
      }
    }

    // NOTE: Initial pageview is tracked in _app page on load
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => router.events.off('routeChangeComplete', handleRouteChange)
  }, [router.events, tracking])
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
