import { NextApiRequest, NextApiResponse } from 'next'
import { initializeApollo } from '@/services/apollo/client'
import * as Auth from '@/services/Auth/Auth'
import logger from '@/services/logger/server'
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

  try {
    const apolloClient = initializeApollo({ req, res })
    const shopSessionService = setupShopSessionServiceServerSide({ apolloClient, req, res })
    const priceIntentService = priceIntentServiceInitServerSide({ apolloClient, req, res })
    const shopSessionId = shopSessionService.shopSessionId()

    if (Auth.getAuthHeader({ req, res })) {
      logger.debug('Resetting auth session')
      Auth.reset({ req, res })
    }

    if (shopSessionId) {
      logger.debug({ shopSessionId }, 'Resetting shop session')
      shopSessionService.reset()

      logger.info({ shopSessionId }, 'Deleting price intent cookies')
      priceIntentService.clearAll(shopSessionId)
    }
  } catch (error) {
    logger.error(error, 'Unable to reset ShopSession')
  }

  const destination = nextURL.toString()
  logger.info(`Re-directing to destination: ${destination}`)
  return res.redirect(destination)
}

export default handler
