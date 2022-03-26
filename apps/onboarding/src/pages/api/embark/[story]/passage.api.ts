import type { NextApiRequest, NextApiResponse } from 'next'
import * as Embark from '@/services/embark'

const fetchPassage = async (req: NextApiRequest, res: NextApiResponse) => {
  const storyName = req.query.story as string
  const passage = await Embark.nextPassage({ req, res, storyName })
  return res.json(passage)
}

export default fetchPassage
