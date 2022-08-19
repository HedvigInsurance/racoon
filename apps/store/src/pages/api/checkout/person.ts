import type { NextApiRequest, NextApiResponse } from 'next'
import { PageLink } from '@/lib/PageLink'
import { initializeApollo } from '@/services/apollo/client'
import { CheckoutService } from '@/services/checkout/CheckoutService'
import { getCurrentShopSessionServerSide } from '@/services/shopSession/ShopSession.helpers'

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const apolloClient = initializeApollo()
  const shopSession = await getCurrentShopSessionServerSide({ req, res, apolloClient })
  const checkoutService = new CheckoutService(shopSession, apolloClient)

  try {
    await checkoutService.personCreate()
    return res.redirect(302, PageLink.checkoutPaymentAdyen())
  } catch (error) {
    return res.status(500).json({ form: 'Unable to update personal details', error })
  }
}

export default handler
