import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { pageview } from '@/services/analytics/gtm'

const useTrackInitialPageView = () => {
  const router = useRouter()

  useEffect(() => {
    const handleLoad = () => pageview(router.asPath)
    window.addEventListener('load', handleLoad)
    return () => window.removeEventListener('load', handleLoad)
  })
}

const useTrackVirtualPageViews = () => {
  const router = useRouter()

  useEffect(() => {
    router.events.on('routeChangeComplete', pageview)
    return () => router.events.off('routeChangeComplete', pageview)
  }, [router.events])
}

export const useTrackPageViews = () => {
  useTrackInitialPageView()
  useTrackVirtualPageViews()
}
