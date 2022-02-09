import type { CampaignQuery, CampaignQueryVariables } from '@/lib/generated-types'
import type { NextApiRequest, NextApiResponse } from 'next'

import { CampaignDocument } from '@/lib/generated-types'
import { Cookie } from 'next-cookie'
import { PageLink } from '@/lib/page-link'
import { createApolloClient } from '@/lib/apollo-client'
import { getFormData } from '@/lib/get-form-data'

const COOKIE_KEY = '_hvcode'

export const config = {
  api: {
    bodyParser: false,
  },
}

const client = createApolloClient()

const handleForeverPageForm = async (req: NextApiRequest, res: NextApiResponse) => {
  const { code, locale } = await getFormData(req)

  if (typeof code !== 'string' || typeof locale !== 'string') {
    return res.status(400).json({ code: 'GENERIC_ERROR_INPUT_REQUIRED' })
  }

  try {
    const { data } = await client.query<CampaignQuery, CampaignQueryVariables>({
      query: CampaignDocument,
      variables: { code },
    })

    if (!data.campaign) {
      return res.status(400).json({ code: 'FOREVER_CODE_ERROR' })
    }

    const cookie = Cookie.fromApiRoute(req, res)
    cookie.set(COOKIE_KEY, code)

    res.redirect(PageLink.foreverReady({ locale, code }))
  } catch (error) {
    return res.status(400).json({ form: 'FOREVER_ERROR_GENERIC' })
  }
}

export default handleForeverPageForm
