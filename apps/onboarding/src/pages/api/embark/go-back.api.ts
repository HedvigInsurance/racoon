import type { NextApiRequest, NextApiResponse } from 'next'
import * as Embark from '@/services/embark/embark'

export const config = { api: { bodyParser: false } }

const postEmbarkGoBack = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const session = Embark.Persistence.get({ req, res })
    if (session === null) throw new Error('Session not found')
    const lastEntry = session.pop()
    Embark.Persistence.save({ req, res, session })
    return res.json({ entry: lastEntry })
  } catch (error) {
    console.error(error)
    return res.status(500).send(error)
  }
}

export default postEmbarkGoBack
