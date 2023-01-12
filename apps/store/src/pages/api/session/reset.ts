import { NextApiRequest, NextApiResponse } from 'next'
import { initializeApollo } from '@/services/apollo/client'
import * as Auth from '@/services/Auth/Auth'
import { priceIntentServiceInitServerSide } from '@/services/priceIntent/PriceIntentService'
import { setupShopSessionServiceServerSide } from '@/services/shopSession/ShopSession.helpers'
import { ORIGIN_URL, PageLink } from '@/utils/PageLink'

/**
 * Reset current ShopSession and navigate to the next page.
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req

  const nextURL = new URL(ORIGIN_URL)
  nextURL.pathname = PageLink.home()

  const nextQueryParam = query['next']
  if (typeof nextQueryParam === 'string') {
    nextURL.pathname = nextQueryParam
  }

  const apolloClient = initializeApollo({ req, res })
  const shopSessionService = setupShopSessionServiceServerSide({ apolloClient, req, res })
  const priceIntentService = priceIntentServiceInitServerSide({ apolloClient, req, res })
  const shopSessionId = shopSessionService.shopSessionId()

  if (Auth.getAuthHeader({ req, res })) {
    console.debug('Resetting auth session')
    Auth.reset({ req, res })
  }

  if (shopSessionId) {
    console.debug(`Resetting shop session, shopSessionId=${shopSessionId}`)
    shopSessionService.reset()
    priceIntentService.clearAll(shopSessionId)
  }

  const destination = nextURL.toString()
  console.log(`Re-directing to destination: ${destination}`)
  return res.redirect(destination)
}

export default handler
