import type { NextApiRequest, NextApiResponse } from 'next'
import { PageLink } from '@/lib/PageLink'
import { initializeApollo } from '@/services/apollo/client'
import { priceIntentServiceInitServerSide } from '@/services/priceIntent/PriceIntent.helpers'
import { getShopSessionServerSide } from '@/services/shopSession/ShopSession.helpers'
import { isCountryCode } from '@/utils/isCountryCode'

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { productId, intent } = req.query
  const { countryCode, ...data } = req.body

  if (typeof productId !== 'string') {
    return res.status(500).json({ message: 'Product ID is required' })
  }

  if (!isCountryCode(countryCode)) {
    return res.status(500).json({ message: 'Country Code is required' })
  }

  const apolloClient = initializeApollo()
  const shopSession = await getShopSessionServerSide({ req, res, apolloClient, countryCode })
  const priceIntentService = priceIntentServiceInitServerSide({ req, res, shopSession })
  const priceIntent = await priceIntentService.fetch(productId)

  await priceIntentService.update({ priceIntentId: priceIntent.id, data })

  if (intent === 'confirm') {
    await priceIntentService.confirm(priceIntent.id)
  }

  return res.redirect(302, PageLink.product({ slug: productId }))
}

export default handler
