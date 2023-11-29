import { type NextApiHandler } from 'next'
import { createTrial, getPartner, getTrialData } from '@/features/widget/debuggerTrialCreate'

const handler: NextApiHandler = async (req, res) => {
  const partner = getPartner(req.body)
  const data = getTrialData(req.body)

  try {
    const externalMemberId = await createTrial(partner, data)
    res.status(200).json({ externalMemberId, email: data.trialData.email })
  } catch (error) {
    res.status(500).send(error instanceof Error ? error.message : 'Unknown error')
  }
}

export default handler
