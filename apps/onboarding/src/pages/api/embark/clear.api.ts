import type { NextApiRequest, NextApiResponse } from 'next'

import { clearEmbarkHistory } from 'services/embark'
import { getFormData } from '@/lib/get-form-data'

export const config = {
  api: {
    bodyParser: false,
  },
}

const handleClearEmbarkHistory = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    clearEmbarkHistory(req, res)
    const { redirectUrl } = await getFormData(req)
    if (typeof redirectUrl === 'string') {
      return res.redirect(redirectUrl)
    }
    return res.json({ ok: true })
  } catch (error) {
    console.error(error)
    return res.status(500).send(error)
  }
}

export default handleClearEmbarkHistory
