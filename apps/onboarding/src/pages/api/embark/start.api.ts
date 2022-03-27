import type { NextApiRequest, NextApiResponse } from 'next'
import { getFormData } from '@/lib/get-form-data'
import { PageLink } from '@/lib/page-link'
import * as Embark from '@/services/embark/embark'

export const config = { api: { bodyParser: false } }

const postEmbarkStart = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { story, locale: rawLocale, ...rawInitialData } = await getFormData(req)

    if (typeof story !== 'string') throw new Error('story is required')
    const locale = typeof rawLocale === 'string' ? rawLocale : undefined

    const initialData = Object.entries(rawInitialData).reduce<Record<string, string>>(
      (data, [key, value]) => {
        if (typeof value === 'string') {
          data[key] = value
        }
        return data
      },
      {},
    )

    const session = Embark.Persistence.create({ story, initialData })
    Embark.Persistence.save({ req, res, session })

    return res.redirect(302, PageLink.embarkTest({ locale }))
  } catch (error) {
    console.error(error)
    return res.status(500).send(error)
  }
}

export default postEmbarkStart
