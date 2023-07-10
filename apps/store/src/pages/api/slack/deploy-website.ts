import { type NextApiRequest, type NextApiResponse } from 'next'
import { ORIGIN_URL } from '@/utils/PageLink'

type SlashCommand = {
  command: string
  response_url: string
  user_id: string
  user_name: string
}

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
  } = req.body as SlashCommand

  if (command !== '/deploy-website') {
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
    res.json({
      response_type: 'ephemeral',
      text: `🤝🏻 Sure, deploying website <@${userId}>!`,
    })
  }, 100)
}

export default handler
