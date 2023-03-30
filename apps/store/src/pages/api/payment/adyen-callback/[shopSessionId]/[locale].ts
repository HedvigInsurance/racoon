import type { NextApiRequest, NextApiResponse } from 'next'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'
import { PageLink } from '@/utils/PageLink'

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { MD: md, PaRes: pares } = req.body
  const { locale, shopSessionId } = req.query

  if (!isRoutingLocale(locale)) return res.status(400).json({ message: 'Invalid locale' })
  if (typeof shopSessionId !== 'string')
    return res.status(400).json({ message: 'Missing ShopSession ID' })

  if (typeof md !== 'string')
    return res.status(400).json({ message: 'MD parameter not found in body' })
  if (typeof pares !== 'string')
    return res.status(400).json({ message: 'PaRes parameter not found in body' })

  // TODO: send API mutation

  return res.redirect(PageLink.checkoutPayment({ locale, shopSessionId }))
}

export default handler
