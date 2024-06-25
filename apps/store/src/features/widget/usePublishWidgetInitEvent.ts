import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'
import { SearchParam } from './parseSearchParams'
import { publishWidgetEvent } from './publishWidgetEvent'

export const usePublishWidgetInitEvent = () => {
  const router = useRouter()

  const requestId = router.query[SearchParam.ExternalRequestId]
  const widgetLoadedSent = useRef(false)

  useEffect(() => {
    if (!router.isReady) return

    if (router.pathname.includes('widget') && !widgetLoadedSent.current) {
      publishWidgetEvent.widgetLoaded()
      widgetLoadedSent.current = true
    }

    if (typeof requestId !== 'string') return

    publishWidgetEvent.event({ requestId })
  }, [requestId, router])
}
