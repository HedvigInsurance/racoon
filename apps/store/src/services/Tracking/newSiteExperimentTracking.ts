// Track experiment impression based on local cookie set by router
import { getCookie, setCookie } from 'cookies-next'
import router from 'next/router'
import { Tracking } from '@/services/Tracking/Tracking'
import { newSiteAbTest } from '../../newSiteAbTest'

export const trackNewSiteExperimentImpression = (tracking: Tracking) => {
  const variantId = getCookie(newSiteAbTest.cookies.variant.name)
  if (typeof variantId !== 'string') return
  tracking.reportExperimentImpression(variantId)
}

export const handleNewSiteExperimentQueryParam = () => {
  router.ready(() => {
    const { query, replace, pathname } = router
    const variantId = query[newSiteAbTest.experimentQueryParam]
    if (typeof variantId !== 'string') return
    setCookie(newSiteAbTest.cookies.variant.name, variantId, {
      maxAge: newSiteAbTest.cookies.variant.maxAge,
    })
    const target = { pathname, query: { ...query } }
    delete target.query[newSiteAbTest.experimentQueryParam]
    console.debug('Record experiment variantId from query parameter')
    replace(target, undefined, { shallow: true })
  })
}
