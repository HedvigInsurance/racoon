import type { NextApiRequest, NextApiResponse } from 'next'
import * as Embark from '@/services/embark/embark'

const getEmbarkPassage = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = Embark.Persistence.get({ req, res })
  if (session === null) throw new Error('Session not found')
  const passage = await Embark.nextPassage({ storyName: session.story, history: session.history })
  return res.json(passage)
}

export default getEmbarkPassage
