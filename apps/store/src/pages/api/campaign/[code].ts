import { NextApiRequest, NextApiResponse } from 'next'
import { initializeApolloServerSide } from '@/services/apollo/client'
import {
  RedeemCampaignDocument,
  RedeemCampaignMutation,
  RedeemCampaignMutationVariables,
} from '@/services/apollo/generated'
import { setupShopSessionServiceServerSide } from '@/services/shopSession/ShopSession.helpers'
import { ShopSession } from '@/services/shopSession/ShopSession.types'
import { getPathnameFromUrl } from '@/utils/getPathnameFromUrl'
import { getCountryByLocale } from '@/utils/l10n/countryUtils'
import { getUrlLocale } from '@/utils/l10n/localeUtils'
import { ORIGIN_URL, PageLink } from '@/utils/PageLink'

enum QueryParam {
  Next = 'next',
  Code = 'code',
}

/**
 * Get or create a ShopSession, redeem a campaign code, and navigate to the next page.
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query, url } = req
  const fallbackRedirect: [number, string] = [307, PageLink.home()]

  if (url === undefined) {
    console.error('Missing url: ', url)
    return res.redirect(...fallbackRedirect)
  }

  const nextUrl = new URL(url, ORIGIN_URL)

  const nextQueryParam = nextUrl.searchParams.get(QueryParam.Next)
  if (!nextQueryParam) {
    console.error('Missing next query parameter: ', url)
    return res.redirect(...fallbackRedirect)
  }
  nextUrl.searchParams.delete(QueryParam.Next)
  nextUrl.pathname = getPathnameFromUrl(nextQueryParam)

  const redirectStatus = 307
  const redirectUrl = nextUrl.toString()

  const locale = getUrlLocale(redirectUrl)
  const { countryCode } = getCountryByLocale(locale)

  const apolloClient = await initializeApolloServerSide({ req, res, locale })
  const shopSessionService = setupShopSessionServiceServerSide({ apolloClient, req, res })

  let shopSession: ShopSession
  try {
    shopSession = await shopSessionService.getOrCreate({ countryCode })
  } catch (error) {
    console.error('Error creating shop session', error)
    return res.redirect(redirectStatus, redirectUrl)
  }

  const campaignCode = query[QueryParam.Code]
  if (typeof campaignCode !== 'string') {
    console.error('Missing campaign code query parameter: ', url)
    return res.redirect(redirectStatus, redirectUrl)
  }

  try {
    const response = await apolloClient.mutate<
      RedeemCampaignMutation,
      RedeemCampaignMutationVariables
    >({
      mutation: RedeemCampaignDocument,
      variables: { shopSessionId: shopSession.id, code: campaignCode },
    })
    const result = response.data?.shopSessionCartCampaignRedeem
    if (!result?.shopSession) {
      const message = `Invalid campaign code: ${campaignCode}`
      console.warn(message, result?.userError?.message)
    }
  } catch (error) {
    console.warn(`Unable to redeem campaign: ${campaignCode}`, error)
  }

  console.log(`Re-directing to destination: ${redirectUrl}`)
  return res.redirect(redirectStatus, redirectUrl)
}

export default handler
