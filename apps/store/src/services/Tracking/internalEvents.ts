import { useCallback } from 'react'
import type { EventInput } from '@/services/graphql/generated'
import { useSendEventBatchMutation } from '@/services/graphql/generated'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import type { TrackingEvent } from '@/services/Tracking/Tracking'
import { isBrowser } from '@/utils/env'

type EventData = {
  type: TrackingEvent
  data: unknown
}

const eventBuffer: Array<Omit<EventInput, 'sessionId'>> = []
export const reportInternalEvent = (event: EventData) => {
  if (!isBrowser()) throw new Error('Must be used client-side')
  eventBuffer.push({
    id: crypto.randomUUID(),
    clientTimestamp: new Date().toISOString(),
    ...event,
  })
}

export const useFlushInternalEvents = () => {
  const shopSessionId = useShopSession().shopSession?.id
  const [sendEventBatch] = useSendEventBatchMutation({
    onError() {
      console.log('Failed to send internal events, ignoring the error')
    },
  })
  return useCallback(() => {
    if (shopSessionId == null) return
    const inputList = eventBuffer.splice(0).map((item) => ({
      ...item,
      sessionId: shopSessionId,
    }))
    if (inputList.length === 0) return
    sendEventBatch({ variables: { inputList } })
  }, [sendEventBatch, shopSessionId])
}
