import type { NextApiRequest, NextApiResponse } from 'next'
import { cartServiceInit } from '@/services/cart/CartService'
import { shopSessionServiceInitServerSide } from '@/services/shopSession/ShopSessionService'
import { isCountryCode } from '@/utils/isCountryCode'

export const handler = async (request: NextApiRequest, response: NextApiResponse) => {
  const { lineId } = request.query
  if (typeof lineId !== 'string') {
    return response.status(500).json({ message: 'Line ID is required' })
  }

  const { countryCode } = request.body
  if (!isCountryCode(countryCode)) {
    return response.status(500).json({ message: 'Country Code is required' })
  }

  const shopSession = await shopSessionServiceInitServerSide({ request, response }).fetch({
    countryCode,
  })
  const cartService = cartServiceInit({ shopSession })

  await cartService.lineRemove(lineId)

  return response.json({ message: 'Line removed' })
}

export default handler
