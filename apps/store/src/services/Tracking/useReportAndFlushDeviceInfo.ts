import { useEffect } from 'react'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { useFlushInternalEvents } from '@/services/Tracking/internalEvents'
import { useTracking } from '@/services/Tracking/useTracking'

export const useReportAndFlushDeviceInfo = () => {
  const { onReady } = useShopSession()
  const tracking = useTracking()
  const flushInternalEvents = useFlushInternalEvents()
  useEffect(() => {
    return onReady(() => {
      tracking.reportDeviceInfo()
      flushInternalEvents()
    })
  }, [tracking, onReady, flushInternalEvents])
}
