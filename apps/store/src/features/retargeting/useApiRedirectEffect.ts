import { datadogLogs } from '@datadog/browser-logs'
import { datadogRum } from '@datadog/browser-rum'
import { useRouter } from 'next/router'
import { useEffect, useMemo } from 'react'
import { RoutingLocale } from '@/utils/l10n/types'
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

    router.push(redirect.url)
  }, [router, redirect])
}

type Redirect = { type: 'api' | 'fallback'; url: URL }

export const getApiRedirect = (href: string, locale: RoutingLocale): Redirect => {
  const url = new URL(href, ORIGIN_URL)
  const shopSessionId = url.searchParams.get(QueryParam.ShopSession)

  if (!shopSessionId) {
    url.pathname = PageLink.store({ locale }).pathname
    return { type: 'fallback', url }
  }

  url.searchParams.delete(QueryParam.ShopSession)
  url.pathname = PageLink.apiRetargeting({ shopSessionId }).pathname
  url.searchParams.set(QueryParam.Locale, locale)
  return { type: 'api', url }
}
