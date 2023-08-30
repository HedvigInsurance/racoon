import { type NextApiRequest, type NextApiResponse } from 'next'
import { fetchRetargetingData } from '@/features/retargeting/fetchRetargetingData'
import { getUserRedirect } from '@/features/retargeting/getUserRedirect'
import { QueryParam } from '@/features/retargeting/retargeting.constants'
import { UserParams } from '@/features/retargeting/retargeting.types'
import { initializeApolloServerSide } from '@/services/apollo/client'
import { getLocaleOrFallback, isRoutingLocale } from '@/utils/l10n/localeUtils'

/**
 * Redirect user to the correct page from a retargeting link.
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.info('Retargeting | Redirecting user')
  const userParams = parseQueryParams(req)
  if (!userParams) {
    res.statusCode = 400
    res.end()
    return
  }

  const apolloClient = await initializeApolloServerSide({ req, res, locale: userParams.locale })
  const data = await fetchRetargetingData(apolloClient, userParams.shopSessionId)
  const redirect = getUserRedirect(userParams, data)

  console.info(`Redirecting | Redirecting user to ${redirect.type}`)
  res.redirect(redirect.url)
}

export default handler

const parseQueryParams = (req: NextApiRequest): UserParams | null => {
  const shopSessionId = req.query[QueryParam.ShopSession]
  if (typeof shopSessionId !== 'string') return null

  const urlLocale = req.query[QueryParam.Locale]
  let locale = getLocaleOrFallback().routingLocale
  if (isRoutingLocale(urlLocale)) {
    locale = urlLocale
  }

  const campaignCode = req.query[QueryParam.CampaignCode]
  return {
    shopSessionId,
    locale,
    ...(typeof campaignCode === 'string' && { campaignCode }),
  }
}
