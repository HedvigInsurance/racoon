import { useEffect, useRef } from 'react'
import { browserName, deviceType, osName } from 'react-device-detect'
import { useSendEventBatchMutation } from '@/services/graphql/generated'
import type { ShopSession } from '@/services/shopSession/ShopSession.types'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { Features } from '@/utils/Features'
import { TrackingEvent } from './TrackingEvent'
import { useTracking } from './useTracking'

export const useReportDeviceInfo = () => {
  const { onReady } = useShopSession()
  const tracking = useTracking()
  const [sendEventBatch] = useSendEventBatchMutation({
    onError() {
      console.log('Failed to send internal events, ignoring the error')
    },
  })

  // Manual deduplication, we don't want to double report in dev mode
  const reportedRef = useRef(false)
  useEffect(
    () =>
      onReady((shopSession: ShopSession) => {
        if (reportedRef.current) return
        reportedRef.current = true

        // Ignore few ancient browsers, universal support for randomUUID appeared in 2021
        if (typeof crypto.randomUUID !== 'function') return

        const data = {
          deviceType,
          osName,
          browserName,
        }
        tracking.reportDeviceInfo(data)
        // Old manual reporting, remove when BEHAVIOR_EVENTS becomes always on
        if (!Features.enabled('BEHAVIOR_EVENTS')) {
          const deviceInfoEvent = {
            type: TrackingEvent.DeviceInfo,
            data,
            id: crypto.randomUUID(),
            sessionId: shopSession.id,
            clientTimestamp: new Date().toISOString(),
          }
          sendEventBatch({ variables: { inputList: [deviceInfoEvent] } })
        }
      }),
    [tracking, onReady, sendEventBatch],
  )
}
