import { type NextApiRequest, type NextApiResponse } from 'next'
import { Slack } from '@/services/slack/slack'
import { Channel } from '@/services/slack/slack.constants'
import { Vercel } from '@/services/vercel/vercel'

type Data = {
  responseUrl: string
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { responseUrl } = req.body as Data

  const slack = new Slack(responseUrl)

  try {
    console.info('Triggering Vercel deploy')
    await Vercel.triggerDeploy()
  } catch (error) {
    console.warn('Failed to trigger Vercel deploy', error)
    await slack.sendMessage('❌ Sorry, not able to trigger a deploy')
    return res.end('ok')
  }

  await slack.sendMessage('🔧 Website deploy triggered')
  await slack.sendMessage(`💁🏻‍♂️ Will post in ${Channel.VercelPurchaseJourney} when it's ready`)
  res.end('ok')
}

export default handler
