import { useEffect, useRef } from 'react'
import { browserName, deviceType, osName } from 'react-device-detect'
import { useSendEventBatchMutation } from '@/services/graphql/generated'
import type { ShopSession } from '@/services/shopSession/ShopSession.types'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { TrackingEvent } from '@/services/Tracking/Tracking'

export const useReportDeviceInfo = () => {
  const { onReady } = useShopSession()
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

        const deviceInfoEvent = {
          type: TrackingEvent.DeviceInfo,
          data: {
            deviceType,
            osName,
            browserName,
          },
          id: crypto.randomUUID(),
          sessionId: shopSession.id,
          clientTimestamp: new Date().toISOString(),
        }
        sendEventBatch({ variables: { inputList: [deviceInfoEvent] } })
      }),
    [onReady, sendEventBatch],
  )
}
