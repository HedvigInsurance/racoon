import { NextApiRequest, NextApiResponse } from 'next'
import { initializeApolloServerSide } from '@/services/apollo/client'
import { getAuthHeaders, resetAuthTokens } from '@/services/authApi/persist'
import { priceIntentServiceInitServerSide } from '@/services/priceIntent/PriceIntentService'
import { setupShopSessionServiceServerSide } from '@/services/shopSession/ShopSession.helpers'

export const resetSessionServerSide = async (req: NextApiRequest, res: NextApiResponse) => {
  const apolloClient = await initializeApolloServerSide({ req, res })
  const shopSessionService = setupShopSessionServiceServerSide({ apolloClient, req, res })
  const priceIntentService = priceIntentServiceInitServerSide({ apolloClient, req, res })

  const authHeaders = getAuthHeaders({ req, res })
  if (Object.keys(authHeaders).length > 0) {
    console.debug('Resetting auth session')
    resetAuthTokens({ req, res })
  }

  const shopSessionId = shopSessionService.shopSessionId()
  if (shopSessionId) {
    console.debug(`Resetting shop session, shopSessionId=${shopSessionId}`)
    shopSessionService.reset()
    priceIntentService.clearAll(shopSessionId)
  }
}
