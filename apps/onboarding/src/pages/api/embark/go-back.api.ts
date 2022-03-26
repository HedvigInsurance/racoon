import type { NextApiRequest, NextApiResponse } from 'next'
import * as Embark from '@/services/embark'

export const config = { api: { bodyParser: false } }

const goBack = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const history = Embark.history(req, res)
    const lastEntry = history.pop()
    Embark.save(req, res, history)
    return res.json({ entry: lastEntry })
  } catch (error) {
    console.error(error)
    return res.status(500).send(error)
  }
}

export default goBack
