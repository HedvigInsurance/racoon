import { NextApiRequest } from 'next'
import { getLocaleOrFallback, isRoutingLocale } from '@/utils/l10n/localeUtils'
import { QueryParam } from './retargeting.constants'
import { UserParams } from './retargeting.types'

export const parseQueryParams = (query: NextApiRequest['query']): UserParams | null => {
  const shopSessionId = query[QueryParam.ShopSession]
  if (typeof shopSessionId !== 'string') return null

  const urlLocale = query[QueryParam.Locale]
  let locale = getLocaleOrFallback().routingLocale
  if (isRoutingLocale(urlLocale)) {
    locale = urlLocale
  }

  const campaignCode = query[QueryParam.CampaignCode]
  return {
    shopSessionId,
    locale,
    ...(typeof campaignCode === 'string' && { campaignCode }),
  }
}
