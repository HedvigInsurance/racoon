import type { GetServerSideProps, NextPage } from 'next'
import { initializeApolloServerSide } from '@/services/apollo/client'
import {
  RedeemCampaignDocument,
  RedeemCampaignMutation,
  RedeemCampaignMutationVariables,
} from '@/services/apollo/generated'
import { fetchPriceTemplate } from '@/services/PriceCalculator/PriceCalculator.helpers'
import { priceIntentServiceInitServerSide } from '@/services/priceIntent/PriceIntentService'
import { setupShopSessionServiceServerSide } from '@/services/shopSession/ShopSession.helpers'
import { ShopSession } from '@/services/shopSession/ShopSession.types'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'
import { ORIGIN_URL, PageLink } from '@/utils/PageLink'

type Props = Record<string, unknown>
type Params = { shopSessionId: string }

const NextSessionPage: NextPage = () => {
  return null
}

export const getServerSideProps: GetServerSideProps<Props, Params> = async (context) => {
  const { locale, params, req, res, query } = context

  const fallbackRedirect = { redirect: { destination: PageLink.home(), permanent: false } }
  if (!isRoutingLocale(locale)) return fallbackRedirect

  const shopSessionId = params?.shopSessionId
  if (!shopSessionId) {
    console.error('No shop session in URL')
    return fallbackRedirect
  }

  const apolloClient = await initializeApolloServerSide({ req, res, locale })
  let shopSession: ShopSession
  try {
    const shopSessionService = setupShopSessionServiceServerSide({ apolloClient, req, res })
    shopSession = await shopSessionService.fetchById(shopSessionId)
    shopSessionService.saveId(shopSession.id)
  } catch (error) {
    console.error(`Unable to fetch ShopSession: ${shopSessionId}`, error)
    return fallbackRedirect
  }

  const nextURL = new URL(ORIGIN_URL)
  nextURL.pathname = PageLink.home({ locale })

  const priceIntentId = query['price_intent_id']
  if (typeof priceIntentId === 'string') {
    try {
      const priceIntentService = priceIntentServiceInitServerSide({ apolloClient, req, res })
      const priceIntent = await priceIntentService.get(priceIntentId)
      if (priceIntent) {
        const templateName = fetchPriceTemplate(priceIntent.product.name)?.name

        if (templateName) {
          priceIntentService.save({ shopSessionId, priceIntentId, templateName })
          nextURL.pathname = priceIntent.product.pageLink
        }
      }
    } catch (error) {
      console.warn(`Unable to redeem price intent: ${priceIntentId}`, error)
    }
  }

  const campaignCode = query['code']
  if (typeof campaignCode === 'string') {
    try {
      await apolloClient.mutate<RedeemCampaignMutation, RedeemCampaignMutationVariables>({
        mutation: RedeemCampaignDocument,
        variables: { shopSessionId: shopSession.id, code: campaignCode },
      })
    } catch (error) {
      console.warn(`Unable to redeem campaign: ${campaignCode}`, error)
    }
  }

  const nextQueryParam = query['next']
  if (typeof nextQueryParam === 'string') {
    const queryLocale = nextQueryParam.split('/')[1]
    if (isRoutingLocale(queryLocale)) {
      nextURL.pathname = nextQueryParam
    } else {
      nextURL.pathname = `/${locale}${nextQueryParam}`
    }
  }

  const destination = nextURL.toString()
  console.log(`Re-directing to destination: ${destination}`)
  return { redirect: { destination, permanent: false } }
}

export default NextSessionPage
