import router from 'next/router'
import { trackExperimentImpression } from '@/services/Tracking/trackExperimentImpression'
import { Tracking } from '@/services/Tracking/Tracking'

export const trackPageViews = (tracking: Tracking) => {
  router.ready(() => {
    tracking.reportPageView(window.location.pathname)
    router.events.on('routeChangeComplete', (url: string, { shallow = false } = {}) => {
      if (!shallow) {
        tracking.reportPageView(url)
        trackExperimentImpression(tracking)
      }
    })
  })
}
