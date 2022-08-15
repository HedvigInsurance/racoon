import type { NextApiRequest, NextApiResponse } from 'next'
import { Market } from '@/lib/l10n/types'
import { PageLink } from '@/lib/PageLink'
import { getFormData } from '@/services/checkout/Checkout.helpers'
import { CheckoutService } from '@/services/checkout/CheckoutService'
import { CookiePersister } from '@/services/checkout/CookiePersister'
import { isLocale } from '@/utils/isLocale'

export const config = {
  api: {
    bodyParser: false,
  },
}

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const checkoutService = new CheckoutService(new CookiePersister(req, res))

  const { market: rawMarket, locale: rawLocale } = await getFormData(req)
  const market = typeof rawMarket === 'string' ? (rawMarket as Market) : Market.Sweden
  const locale = isLocale(rawLocale) ? rawLocale : undefined

  const checkout = await checkoutService.checkoutCreate({ market })

  if (checkout.type === 'PERSON') {
    return res.redirect(302, PageLink.checkout({ locale }))
  } else if (checkout.type === 'PERSON_SIGN') {
    return res.redirect(302, PageLink.checkoutSign({ locale }))
  } else {
    return res.status(500).json({ error: `Unexpected checkout state: ${checkout.type}` })
  }
}

export default handler
