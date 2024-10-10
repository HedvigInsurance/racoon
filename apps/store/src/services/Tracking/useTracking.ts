import { useContext, useRef } from 'react'
import { InternalReporterContext } from '@/appComponents/providers/InternalReporterProvider'
import { Tracking } from './Tracking'
import { TrackingContext } from './TrackingContext'

export const useTracking = (): Tracking => {
  const data = useContext(TrackingContext)
  const internalReporter = useContext(InternalReporterContext)

  // Optimization: keep single instance then update in-place
  // Makes sure returned value is stable and callbacks depending on it are not recreated
  // every time something in the context changes
  const trackingRef = useRef(new Tracking())
  trackingRef.current.context = data
  trackingRef.current.internalEventReporter = internalReporter
  return trackingRef.current
}
