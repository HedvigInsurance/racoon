import { useContext, useRef } from 'react'
import { Tracking } from './Tracking'
import { TrackingContext } from './TrackingContext'

export const useTracking = (): Tracking => {
  const data = useContext(TrackingContext)

  // Optimization: keep single instance then update context in-place
  // Makes sure returned value is stable and callbacks depending on it are not recreated
  // every time something in the context changes
  const trackingRef = useRef(new Tracking())
  trackingRef.current.context = data
  return trackingRef.current
}
