import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { publishWidgetEvent } from './publishWidgetEvent'

export const PARTNER_REQUEST_ID_SEARCH_PARAM = 'partnerRequestId'

export const usePublishWidgetInitEvent = () => {
  const router = useRouter()

  const requestId = router.query[PARTNER_REQUEST_ID_SEARCH_PARAM]
  useEffect(() => {
    if (!router.isReady) return
    if (typeof requestId !== 'string') return

    publishWidgetEvent({ status: 'event', message: { requestId } })

    const newQuery = { ...router.query }
    delete newQuery[PARTNER_REQUEST_ID_SEARCH_PARAM]
    router.replace({ query: newQuery }, undefined, { shallow: true })
  }, [requestId, router])
}
