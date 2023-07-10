import { type NextApiRequest, type NextApiResponse } from 'next'
import { Slack } from '@/services/slack/slack'
import { SlashCommand } from '@/services/slack/slack.constants'
import { SlashCommandRequest } from '@/services/slack/slack.types'
import { ORIGIN_URL } from '@/utils/PageLink'

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  if (req.query.secret !== process.env.SLACK_SECRET) {
    return res.status(401).json({ message: 'Invalid token' })
  }

  const {
    command,
    response_url: responseUrl,
    user_id: userId,
    user_name: userName,
  } = req.body as SlashCommandRequest

  if (command !== SlashCommand.DeployWebsite) {
    return res.status(400).json({ message: `Unknown slash command: ${command}` })
  }

  console.info(`Triggering website deploy for ${userName}`)
  const url = `${ORIGIN_URL}/api/slack/deploy-website-work`
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ responseUrl: responseUrl }),
  }).catch((error) => {
    console.warn('Failed to trigger website deploy', error)
  })

  setTimeout(() => {
    res.json(Slack.composeMessage(`Deploying website for <@${userId}>`))
  }, 100)
}

export default handler
