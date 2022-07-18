import type { NextApiRequest, NextApiResponse } from 'next'
import { PageLink } from '@/lib/PageLink'
import { CheckoutService } from '@/services/checkout/CheckoutService'
import { CookiePersister } from '@/services/checkout/CookiePersister'

export const config = {
  api: {
    bodyParser: false,
  },
}

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const checkoutService = new CheckoutService(new CookiePersister(req, res))
  const checkout = await checkoutService.checkout()

  if (checkout === null) {
    return res.status(500).json({ error: 'Unable to find checkout' })
  }

  try {
    const updatedCheckout = await checkoutService.paymentConnectSign({ checkout })

    if (updatedCheckout.type === 'COMPLETED') {
      return res.redirect(302, PageLink.confirmation())
    } else {
      return res.redirect(302, PageLink.checkoutPaymentAdyen())
    }
  } catch (error) {
    return res.status(500).json({ form: 'Unable to connect payment', error })
  }
}

export default handler
