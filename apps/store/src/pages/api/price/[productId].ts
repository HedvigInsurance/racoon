import type { NextApiRequest, NextApiResponse } from 'next'
import { PageLink } from '@/lib/PageLink'
import { priceIntentServiceInitServerSide } from '@/services/priceIntent/PriceIntentService'
import { shopSessionServiceInitServerSide } from '@/services/shopSession/ShopSessionService'
import { isCountryCode } from '@/utils/isCountryCode'

export const handler = async (request: NextApiRequest, response: NextApiResponse) => {
  const { productId, intent } = request.query
  const { countryCode, ...data } = request.body

  if (typeof productId !== 'string') {
    return response.status(500).json({ message: 'Product ID is required' })
  }

  if (!isCountryCode(countryCode)) {
    return response.status(500).json({ message: 'Country Code is required' })
  }

  const shopSession = await shopSessionServiceInitServerSide({ request, response }).fetch({
    countryCode,
  })
  const priceIntentService = priceIntentServiceInitServerSide({ request, response, shopSession })

  const priceIntent = await priceIntentService.fetch(productId)

  await priceIntentService.update({ priceIntentId: priceIntent.id, data })

  if (intent === 'confirm') {
    await priceIntentService.confirm(priceIntent.id)
  }

  return response.redirect(302, PageLink.product({ slug: productId }))
}

export default handler
