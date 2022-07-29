import type { NextApiRequest, NextApiResponse } from 'next'
import { initializeApollo } from '@/services/apollo/client'
import { cartServiceInit } from '@/services/cart/CartService'
import { getShopSessionServerSide } from '@/services/shopSession/ShopSession.helpers'
import { isCountryCode } from '@/utils/isCountryCode'

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { lineId } = req.query
  if (typeof lineId !== 'string') return res.status(500).json({ message: 'Line ID is required' })

  const { countryCode } = req.body
  if (!isCountryCode(countryCode)) {
    return res.status(500).json({ message: 'Country Code is required' })
  }

  const apolloClient = initializeApollo()
  const shopSession = await getShopSessionServerSide({ req, res, apolloClient, countryCode })
  const cartService = cartServiceInit({ shopSession })

  await cartService.lineAdd(lineId)

  return res.json({ message: 'Line added' })
}

export default handler
