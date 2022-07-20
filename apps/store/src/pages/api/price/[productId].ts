import type { NextApiRequest, NextApiResponse } from 'next'
import { priceIntentServiceInitServerSide } from '@/services/priceIntent/PriceIntentService'

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { productId } = req.query
  if (typeof productId !== 'string')
    return res.status(500).json({ message: 'Product ID is required' })

  const priceIntentService = priceIntentServiceInitServerSide(req, res)

  const priceIntent = await priceIntentService.fetch(productId)

  await priceIntentService.update({ priceIntentId: priceIntent.id, data: req.body })

  return res.redirect(302, '/price/' + productId)
}

export default handler
