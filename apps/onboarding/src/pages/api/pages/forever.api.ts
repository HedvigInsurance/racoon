import type { NextApiRequest, NextApiResponse } from 'next'
import { getFormData } from '@/lib/get-form-data'
import { PageLink } from '@/lib/page-link'
import { QuoteCart } from '@/services/quote-cart'

export const config = {
  api: {
    bodyParser: false,
  },
}

const handleForeverPageForm = async (req: NextApiRequest, res: NextApiResponse) => {
  const quoteCartId = req.cookies[QuoteCart.COOKIE_KEY]

  if (typeof quoteCartId !== 'string') {
    console.error('Missing quote cart session')
    return res.status(400).json({ form: 'FOREVER_ERROR_GENERIC' })
  }

  const { code, locale } = await getFormData(req)

  if (typeof code !== 'string' || typeof locale !== 'string') {
    return res.status(400).json({ code: 'GENERIC_ERROR_INPUT_REQUIRED' })
  }

  try {
    const addedCampaign = await QuoteCart.addCampaign({ id: quoteCartId, code })

    if (addedCampaign === null) {
      return res.status(400).json({ code: 'FOREVER_CODE_ERROR' })
    }

    return res.redirect(302, PageLink.foreverReady({ locale, code }))
  } catch (error) {
    console.error('Unknown error adding campaign code', error)
    return res.status(500).json({ form: 'FOREVER_ERROR_GENERIC' })
  }
}

export default handleForeverPageForm
