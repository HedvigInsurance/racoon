import { useContext } from 'react'
import { TrackingContext } from './TrackingContext'

export const useTracking = () => {
  return useContext(TrackingContext)
}
