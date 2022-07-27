import type { NextApiRequest, NextApiResponse } from 'next'
import { cartServiceInitServerSide } from '@/services/cart/CartService'

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { lineId } = req.query

  if (typeof lineId !== 'string') return res.status(500).json({ message: 'Line ID is required' })

  const cartService = cartServiceInitServerSide(req, res)

  await cartService.lineRemove(lineId)

  return res.redirect(302, req.headers.referer || '/')
}

export default handler
