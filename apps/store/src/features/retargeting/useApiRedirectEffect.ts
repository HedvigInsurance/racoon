import { datadogLogs } from '@datadog/browser-logs'
import { datadogRum } from '@datadog/browser-rum'
import { useRouter } from 'next/router'
import { useEffect, useMemo } from 'react'
import { type RoutingLocale } from '@/utils/l10n/types'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'
import { ORIGIN_URL, PageLink } from '@/utils/PageLink'
import { QueryParam } from './retargeting.constants'

export const useApiRedirectEffect = () => {
  const router = useRouter()
  const { routingLocale } = useCurrentLocale()

  const redirect = useMemo(() => {
    if (!router.isReady) return null
    return getApiRedirect(router.asPath, routingLocale)
  }, [routingLocale, router.asPath, router.isReady])

  useEffect(() => {
    if (!redirect) return

    if (redirect.type === 'fallback') {
      datadogLogs.logger.warn('Retargeting | Missing shop session ID', {
        url: window.location.href,
      })
    } else {
      datadogRum.setGlobalContextProperty('isRetargeting', true)
    }

    // Avoid `router.push` since it triggers middleware for API routes
    window.location.assign(redirect.url.toString())
  }, [router, redirect, routingLocale])
}

type Redirect = { type: 'api' | 'fallback'; url: URL }

export const getApiRedirect = (href: string, locale: RoutingLocale): Redirect => {
  const url = new URL(href, ORIGIN_URL)

  const shopSessionId = url.searchParams.get(QueryParam.ShopSession)

  if (!shopSessionId) {
    const fallbackUrl = PageLink.store({ locale })
    fallbackUrl.search = url.search
    return { type: 'fallback', url: fallbackUrl }
  }

  url.searchParams.delete(QueryParam.ShopSession)

  const apiUrl = PageLink.apiRetargeting({ shopSessionId, locale })
  url.searchParams.forEach((value, key) => apiUrl.searchParams.set(key, value))
  return { type: 'api', url: apiUrl }
}
