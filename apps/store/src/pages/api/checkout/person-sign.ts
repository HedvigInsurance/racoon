import type { NextApiRequest, NextApiResponse } from 'next'
import { PageLink } from '@/lib/PageLink'
import { getFormData } from '@/services/checkout/Checkout.helpers'
import { CheckoutService } from '@/services/checkout/CheckoutService'
import { CookiePersister } from '@/services/checkout/CookiePersister'
import { getOrThrowFormValue } from '@/utils/getOrThrowFormValue'

export const config = {
  api: {
    bodyParser: false,
  },
}

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const formData = await getFormData(req)

  const checkoutService = new CheckoutService(new CookiePersister(req, res))
  const checkout = await checkoutService.checkout()

  if (checkout === null) {
    return res.status(500).json({ error: 'Unable to find checkout' })
  }

  try {
    const postSignCheckout = await checkoutService.personCreateSign({
      checkout,
      person: {
        personalNumber: getOrThrowFormValue(formData, 'personalNumber'),
        firstName: getOrThrowFormValue(formData, 'firstName'),
        lastName: getOrThrowFormValue(formData, 'lastName'),
        email: getOrThrowFormValue(formData, 'email'),
      },
    })

    if (postSignCheckout.type === 'UPDATE_PAYMENT') {
      return res.redirect(302, PageLink.checkoutPaymentUpdate())
    } else {
      return res.status(500).json({ error: `Unexpected checkout state: ${postSignCheckout.type}` })
    }
  } catch (error) {
    return res.status(500).json({ form: 'Unable to update personal details', error })
  }
}

export default handler
