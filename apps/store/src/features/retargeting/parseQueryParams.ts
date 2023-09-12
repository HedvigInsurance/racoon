import { type NextApiRequest } from 'next'
import { getLocaleOrFallback, isRoutingLocale } from '@/utils/l10n/localeUtils'
import { QueryParam } from './retargeting.constants'
import { type UserParams } from './retargeting.types'

const KNOWN_PARAMS = new Set(Object.values(QueryParam))

export const parseQueryParams = (query: NextApiRequest['query']): UserParams | null => {
  const shopSessionId = query[QueryParam.ShopSession]
  if (typeof shopSessionId !== 'string') return null

  const urlLocale = query[QueryParam.Locale]
  let locale = getLocaleOrFallback().routingLocale
  if (isRoutingLocale(urlLocale)) {
    locale = urlLocale
  }

  const campaignCode = query[QueryParam.CampaignCode]

  const queryParams = Object.entries(query).reduce(
    (acc, [key, value]) => {
      if (!KNOWN_PARAMS.has(key as QueryParam)) {
        acc.push([key, value])
      }
      return acc
    },
    [] as Array<[string, unknown]>,
  )

  return {
    shopSessionId,
    locale,
    ...(typeof campaignCode === 'string' && { campaignCode }),
    queryParams,
  }
}
