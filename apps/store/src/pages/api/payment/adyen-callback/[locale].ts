import type { NextApiRequest, NextApiResponse } from 'next'
import { AuthStatus } from '@/components/CheckoutPaymentPage/CheckoutPaymentPage.constants'
import { isSupportedLocale } from '@/lib/l10n/localeUtils'
import { PageLink } from '@/lib/PageLink'

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { MD: md, PaRes: pares } = req.body

  if (!isSupportedLocale(req.query.locale))
    return res.status(400).json({ message: 'Invalid locale' })

  const locale = req.query.locale

  if (typeof md !== 'string')
    return res.status(400).json({ message: 'MD parameter not found in body' })
  if (typeof pares !== 'string')
    return res.status(400).json({ message: 'PaRes parameter not found in body' })

  // TODO: send API mutation

  return res.redirect(
    PageLink.checkoutPayment({
      locale,
      authStatus: AuthStatus.Success,
    }),
  )
}

export default handler
