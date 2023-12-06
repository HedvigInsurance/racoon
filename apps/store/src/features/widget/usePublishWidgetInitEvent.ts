import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { publishWidgetEvent } from './publishWidgetEvent'
import { EXTERNAL_REQUEST_ID_QUERY_PARAM } from './widget.constants'

export const usePublishWidgetInitEvent = () => {
  const router = useRouter()

  const requestId = router.query[EXTERNAL_REQUEST_ID_QUERY_PARAM]
  useEffect(() => {
    if (!router.isReady) return
    if (typeof requestId !== 'string') return

    publishWidgetEvent.event({ requestId })

    const newQuery = { ...router.query }
    delete newQuery[EXTERNAL_REQUEST_ID_QUERY_PARAM]
    router.replace({ query: newQuery }, undefined, { shallow: true })
  }, [requestId, router])
}
