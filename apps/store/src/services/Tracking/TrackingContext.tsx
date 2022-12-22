import { useRouter } from 'next/router'
import { createContext, ProviderProps, useEffect } from 'react'
import { setGtmContext } from '@/services/gtm'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { Tracking } from '@/services/Tracking/Tracking'
import { useHandleExperimentQueryParam } from '@/services/Tracking/useHandleExperimentQueryParam'
import { useCurrentCountry } from '@/utils/l10n/useCurrentCountry'

export const TrackingContext = createContext(new Tracking())

export const TrackingProvider = ({ value: tracking, children }: ProviderProps<Tracking>) => {
  useTrackPageViews(tracking)
  useMaintainCountryContext(tracking)
  useTrackShopSession(tracking)
  useHandleExperimentQueryParam(tracking)

  return <TrackingContext.Provider value={tracking}>{children}</TrackingContext.Provider>
}

const useMaintainCountryContext = (tracking: Tracking) => {
  const { countryCode } = useCurrentCountry()
  tracking.setContext('countryCode', countryCode)
  useEffect(() => {
    setGtmContext(countryCode)
  }, [countryCode])
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
