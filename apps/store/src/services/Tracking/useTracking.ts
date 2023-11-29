import { useContext, useMemo } from 'react'
import { Tracking } from './Tracking'
import { TrackingContext } from './TrackingContext'

export const useTracking = () => {
  const data = useContext(TrackingContext)

  return useMemo(() => {
    return new Tracking(data)
  }, [data])
}
