import { useCallback } from 'react'
import { pushToGTMDataLayer } from '@/services/analytics/gtm'

/**
 * @param event event name
 * @param data initial data
 * @returns A `track` function which can be called when event is triggered. This function supports passing additional data which means that this function can overwrite the initial data.
 *
 * @example
 * // Set default properties and track event
 * const trackPageView = useTrackEvent('begin_onboarding_page', {
 *   begin_from: referer,
 * })
 * useEffect(() => {
 *  trackPageView() // will send eventData: `{ begin_from: <referer> }`
 * }, [trackPageView])
 *
 * @example
 * // Add additional properties when event is tracked
 * const trackSelectedCard = useTrackEvent('begin_onboarding_insurance_type_selected', {
 *   begin_from: referer,
 * })
 * const handleClick = (type) => {
 *   trackSelectedCard({ type }) // will send eventData: `{ begin_from: <referer>, type: <type> }`
 * }
 */
export const useTrackEvent = (event: string, data?: Record<string, any>) => {
  const track = useCallback(
    (newData?: Record<string, any>) => {
      const eventData = {
        ...data,
        ...newData,
      }

      pushToGTMDataLayer({ event, eventData })
    },
    [event, data],
  )

  return track
}
