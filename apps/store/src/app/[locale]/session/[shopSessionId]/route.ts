import { type ResponseCookies } from 'next/dist/compiled/@edge-runtime/cookies'
import { redirect } from 'next/navigation'
import { type NextRequest, NextResponse } from 'next/server'
import { setupApolloClient } from '@/services/apollo/app-router/rscClient'
import {
  RedeemCampaignDocument,
  type RedeemCampaignMutation,
  type RedeemCampaignMutationVariables,
} from '@/services/graphql/generated'
import { getPriceTemplate } from '@/services/PriceCalculator/PriceCalculator.helpers'
import { priceIntentServiceInitServerSide } from '@/services/priceIntent/PriceIntentService'
import { setupShopSessionServiceServerSide } from '@/services/shopSession/ShopSession.helpers'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'
import { type RoutingLocale } from '@/utils/l10n/types'
import { PageLink } from '@/utils/PageLink'

type Params = {
  locale: RoutingLocale
  shopSessionId: string
}
export async function GET(req: NextRequest, { params }: { params: Params }) {
  const { locale, shopSessionId } = params
  if (!isRoutingLocale(locale)) return redirect('/')

  //Provides a container for writing response cookies, we'll copy it to final redirect response
  const res = new NextResponse()

  const { getApolloClient } = setupApolloClient({ locale })
  const apolloClient = getApolloClient()
  try {
    const shopSessionService = setupShopSessionServiceServerSide({ apolloClient, req, res })
    await shopSessionService.fetchById(shopSessionId)
    shopSessionService.saveId(shopSessionId)
  } catch (error) {
    console.error(`Unable to fetch ShopSession: ${shopSessionId}`, error)
    return redirect(PageLink.home({ locale }).toString())
  }

  const targetUrl = req.nextUrl.clone()
  targetUrl.pathname = PageLink.home({ locale }).pathname
  targetUrl.searchParams.delete('shopSessionId') // Generally should not be there in the first place

  const campaignCode = req.nextUrl.searchParams.get('code')
  if (campaignCode != null) {
    targetUrl.searchParams.delete('code')
    try {
      await apolloClient.mutate<RedeemCampaignMutation, RedeemCampaignMutationVariables>({
        mutation: RedeemCampaignDocument,
        variables: { shopSessionId, code: campaignCode },
      })
    } catch (error) {
      console.warn(`Unable to redeem campaign: ${campaignCode}`, error)
    }
  }

  const priceIntentId = req.nextUrl.searchParams.get('price_intent_id')
  if (priceIntentId != null) {
    targetUrl.searchParams.delete('price_intent_id')
    try {
      const priceIntentService = priceIntentServiceInitServerSide({ apolloClient, req, res })
      const priceIntent = await priceIntentService.get(priceIntentId)
      if (priceIntent) {
        const templateName = getPriceTemplate(priceIntent.product.name)?.name
        if (templateName != null) {
          priceIntentService.save({ shopSessionId, priceIntentId, templateName })
          // TODO: use price calculator page depending on feature flag
          targetUrl.pathname = priceIntent.product.pageLink
        } else {
          console.warn(
            'Found priceIntent, but no priceTemplate for it. "' +
              'Should not normally happen unless original session used different configuration',
          )
        }
      }
    } catch (error) {
      console.warn(`Unable to get price intent: ${priceIntentId}`, error)
    }
  }

  const nextQueryParam = req.nextUrl.searchParams.get('next')
  if (nextQueryParam != null) {
    targetUrl.searchParams.delete('next')
    const queryLocale = nextQueryParam.split('/')[1]
    if (isRoutingLocale(queryLocale)) {
      console.info(`Valid locale ${queryLocale} contained in next url ${nextQueryParam}`)
      targetUrl.pathname = nextQueryParam
    } else {
      console.warn(
        `Invalid locale ${queryLocale} contained in next url ${nextQueryParam}. Using ${locale} locale`,
      )
      targetUrl.pathname = `/${locale}${nextQueryParam}`
    }
  }
  return redirectWithCookies(targetUrl, res.cookies)
}

const redirectWithCookies = (targetUrl: URL, cookies: ResponseCookies) => {
  const result = NextResponse.redirect(targetUrl)
  for (const cookie of cookies.getAll()) {
    result.cookies.set(cookie)
  }
  return result
}
