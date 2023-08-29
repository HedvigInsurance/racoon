import { datadogLogs } from '@datadog/browser-logs'
import Router from 'next/router'
import { getLocaleOrFallback } from '@/utils/l10n/localeUtils'
import { type UiLocale } from '@/utils/l10n/types'
import { PageLink } from '@/utils/PageLink'
import { QueryParam } from './retargeting.constants'

export const validateUrl = () => {
  Router.ready(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const shopSessionId = searchParams.get(QueryParam.ShopSession)
    if (!shopSessionId) {
      datadogLogs.logger.warn('Retargeting | Missing shop session in url')
      const { routingLocale } = getLocaleOrFallback(Router.locale as UiLocale)
      window.location.assign(PageLink.store({ locale: routingLocale }))
    }
  })
}
