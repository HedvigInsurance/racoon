import type { NextApiRequest, NextApiResponse } from 'next'
import { LINE_PREFIX } from '@/components/CartReviewPage/CartReviewPage.constants'
import { initializeApollo } from '@/services/apollo/client'
import { cartServiceInit } from '@/services/cart/CartService'
import { getCurrentShopSessionServerSide } from '@/services/shopSession/ShopSession.helpers'

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const apolloClient = initializeApollo()
    const shopSession = await getCurrentShopSessionServerSide({ req, res, apolloClient })
    const cartService = cartServiceInit({ shopSession, apolloClient })

    await Promise.all(
      Object.entries(req.body)
        .filter(([key]) => key.startsWith(LINE_PREFIX))
        .map(([key, value]) => {
          const lineId = key.replace(LINE_PREFIX, '')
          const startDate =
            typeof value === 'string' ? (value === '' ? null : new Date(value)) : null
          return cartService.startDateUpdate(lineId, startDate)
        }),
    )

    return res.json({ success: true })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ success: false })
  }
}

export default handler
