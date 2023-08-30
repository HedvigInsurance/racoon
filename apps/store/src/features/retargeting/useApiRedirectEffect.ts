import { datadogLogs } from '@datadog/browser-logs'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'
import { PageLink } from '@/utils/PageLink'
import { QueryParam } from './retargeting.constants'

export const useApiRedirectEffect = () => {
  const router = useRouter()
  const { routingLocale } = useCurrentLocale()
  useEffect(() => {
    const url = new URL(window.location.href)
    const shopSessionId = url.searchParams.get(QueryParam.ShopSession)

    if (!shopSessionId) {
      datadogLogs.logger.warn('Retargeting | Missing shop session ID', {
        url: window.location.href,
      })
      router.push(PageLink.store({ locale: routingLocale }))
      return
    }

    url.searchParams.delete(QueryParam.ShopSession)
    url.pathname = PageLink.apiRetargeting({ shopSessionId })
    url.searchParams.set(QueryParam.Locale, routingLocale)
    router.push(url)
  }, [router, routingLocale])
}
