import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { publishPartnerEvent } from './publishPartnerEvent'

export const PARTNER_REQUEST_ID_QUERY_PARAM = 'partnerRequestId'

export const usePublishPartnerInitEvent = () => {
  const router = useRouter()

  const requestId = router.query[PARTNER_REQUEST_ID_QUERY_PARAM]
  useEffect(() => {
    if (!router.isReady) return
    if (typeof requestId !== 'string') return

    publishPartnerEvent({ status: 'event', message: { requestId } })

    const newQuery = { ...router.query }
    delete newQuery[PARTNER_REQUEST_ID_QUERY_PARAM]
    router.replace({ query: newQuery }, undefined, { shallow: true })
  }, [requestId, router])
}
