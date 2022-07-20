import type { NextApiRequest, NextApiResponse } from 'next'
import { PageLink } from '@/lib/PageLink'
import { priceIntentServiceInitServerSide } from '@/services/priceIntent/PriceIntentService'

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { productId, intent } = req.query

  if (typeof productId !== 'string') {
    return res.status(500).json({ message: 'Product ID is required' })
  }

  const priceIntentService = priceIntentServiceInitServerSide(req, res)

  const priceIntent = await priceIntentService.fetch(productId)

  await priceIntentService.update({ priceIntentId: priceIntent.id, data: req.body })

  if (intent === 'confirm') {
    await priceIntentService.confirm(priceIntent.id)
  }

  return res.redirect(302, PageLink.test_price({ productId }))
}

export default handler
