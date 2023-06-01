// Track experiment impression based on local cookie set by router
import { getCookie, setCookie } from 'cookies-next'
import router, { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Tracking } from '@/services/Tracking/Tracking'
import { newSiteAbTest } from '../../newSiteAbTest'

export const trackNewSiteExperimentImpression = (tracking: Tracking) => {
  const variantId = getCookie(newSiteAbTest.cookies.variant.name)
  if (typeof variantId !== 'string') return
  tracking.reportExperimentImpression(newSiteAbTest.optimizeExperimentId, variantId)
}

export const handleNewSiteExperimentQueryParam = () => {
  router.ready(() => {
    const url = new URL(window.location.href)
    const variantId = url.searchParams.get(newSiteAbTest.experimentQueryParam)
    if (!variantId) return
    setCookie(newSiteAbTest.cookies.variant.name, variantId, {
      maxAge: newSiteAbTest.cookies.variant.maxAge,
    })
    console.debug('Record experiment variantId from query parameter')
  })
}

export const useRemoveExperimentQueryParam = () => {
  const router = useRouter()
  useEffect(() => {
    if (router.query[newSiteAbTest.experimentQueryParam]) {
      const target = { pathname: router.pathname, query: { ...router.query } }
      delete target.query[newSiteAbTest.experimentQueryParam]
      router.replace(target, undefined, { shallow: true })
    }
  }, [router])
}
