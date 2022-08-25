import type { NextApiRequest, NextApiResponse } from 'next'
import { PageLink } from '@/lib/PageLink'
import { initializeApollo } from '@/services/apollo/client'
import { cartServiceInit } from '@/services/cart/CartService'
import { getCurrentShopSessionServerSide } from '@/services/shopSession/ShopSession.helpers'
import { ShopSession } from '@/services/shopSession/ShopSession.types'

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { lineId } = req.query

  if (typeof lineId !== 'string') {
    return res.status(500).json({ message: 'Line ID is required' })
  }

  const apolloClient = initializeApollo()

  let shopSession: ShopSession
  try {
    shopSession = await getCurrentShopSessionServerSide({ req, res, apolloClient })
  } catch (error) {
    console.error('Failed to setup ShopSession')
    console.error(error)
    return res.redirect(PageLink.cart())
  }

  const cartService = cartServiceInit({ shopSession, apolloClient })

  try {
    await cartService.lineRemove(lineId)
  } catch (error) {
    console.warn('Failed to remove cart line item: %s', lineId)
    console.warn(error)
    return res.redirect(PageLink.cart())
  }

  return res.redirect(302, PageLink.cart())
}

export default handler
