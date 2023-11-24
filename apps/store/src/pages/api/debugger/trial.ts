import { type NextApiHandler } from 'next'
import { createTrial, getAvyWidgetUrl, getTrialData } from '@/features/widget/debuggerTrialCreate'

const handler: NextApiHandler = async (req, res) => {
  const data = getTrialData(req.body)

  try {
    const externalMemberId = await createTrial(data)
    res.redirect(302, getAvyWidgetUrl(externalMemberId).toString())
  } catch (error) {
    res.status(500).json(error)
  }
}

export default handler
