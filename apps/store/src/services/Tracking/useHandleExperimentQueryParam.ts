// Track experiment impression based on local cookie set by router
import { getCookie, setCookie } from 'cookies-next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Tracking } from '@/services/Tracking/Tracking'
import { newSiteAbTest } from '../../newSiteAbTest'

export const trackNewSiteExperimentImpression = (tracking: Tracking) => {
  const variantId = getCookie(newSiteAbTest.cookies.variant.name)
  if (typeof variantId !== 'string') return
  tracking.reportExperimentImpression(variantId)
}

export const useHandleExperimentQueryParam = (tracking: Tracking) => {
  const { pathname, query, isReady, replace } = useRouter()
  useEffect(() => {
    const variantId = query[newSiteAbTest.experimentQueryParam]
    if (isReady && typeof variantId === 'string') {
      setCookie(newSiteAbTest.cookies.variant.name, variantId, {
        maxAge: newSiteAbTest.cookies.variant.maxAge,
      })
      const target = { pathname, query: { ...query } }
      delete target.query[newSiteAbTest.experimentQueryParam]
      console.debug('Record experiment variantId from query parameter')
      trackNewSiteExperimentImpression(tracking)
      replace(target, undefined, { shallow: true })
    }
  }, [query, isReady, pathname, replace, tracking])
}
