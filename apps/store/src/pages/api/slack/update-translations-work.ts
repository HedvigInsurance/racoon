import { type NextApiRequest, type NextApiResponse } from 'next'
import { GitHub } from '@/services/github/github'
import { Slack } from '@/services/slack/slack'

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
    await GitHub.triggerWorkflowDownloadTranslations()
  } catch (error) {
    console.warn('Failed to trigger GitHub workflow', error)
    await slack.sendMessage('❌ Sorry, not able to update translations')
    return res.end('ok')
  }

  await slack.sendMessage('🔧 Translation update triggered')
  res.end('ok')
}

export default handler
