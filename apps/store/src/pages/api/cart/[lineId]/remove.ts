import type { NextApiRequest, NextApiResponse } from 'next'
import { PageLink } from '@/lib/PageLink'
import { initializeApollo } from '@/services/apollo/client'
import { cartServiceInit } from '@/services/cart/CartService'
import { getCurrentShopSessionServerSide } from '@/services/shopSession/ShopSession.helpers'

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { lineId } = req.query
  if (typeof lineId !== 'string') {
    return res.status(500).json({ message: 'Line ID is required' })
  }

  const apolloClient = initializeApollo()
  const shopSession = await getCurrentShopSessionServerSide({ req, res, apolloClient })
  const cartService = cartServiceInit({ shopSession, apolloClient })

  await cartService.lineRemove(lineId)

  return res.redirect(302, PageLink.cart())
}

export default handler
