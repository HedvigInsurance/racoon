import type { NextApiRequest, NextApiResponse } from 'next'
import { clearEmbarkHistory, updateEmbarkHistory } from 'services/embark'

import { getFormData } from '@/lib/get-form-data'

export const config = {
  api: {
    bodyParser: false,
  },
}

const handleClearEmbarkHistory = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    clearEmbarkHistory(req, res)

    const { redirectUrl, ...rawInitialData } = await getFormData(req)

    const initialData = Object.entries(rawInitialData).reduce<Record<string, string>>(
      (data, [key, value]) => {
        if (typeof value === 'string') {
          data[key] = value
        }
        return data
      },
      {},
    )

    updateEmbarkHistory(req, res, [{ passageName: 'INITIAL_DATA', storeDiff: initialData }])

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
