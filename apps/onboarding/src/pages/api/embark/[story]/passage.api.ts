import type { NextApiRequest, NextApiResponse } from 'next'

import { getNextEmbarkPassage } from 'services/embark'

const fetchPassage = async (req: NextApiRequest, res: NextApiResponse) => {
  const storyName = req.query.story as string
  const passage = await getNextEmbarkPassage({ req, res, storyName })
  return res.json(passage)
}

export default fetchPassage
