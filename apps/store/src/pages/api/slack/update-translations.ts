import { type NextApiRequest, type NextApiResponse } from 'next'
import { ORIGIN_URL } from '@/utils/PageLink'

type SlashCommand = {
  command: string
  response_url: string
  user_id: string
}

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  if (req.query.secret !== process.env.SLACK_SECRET) {
    return res.status(401).json({ message: 'Invalid token' })
  }

  const { command, response_url, user_id } = req.body as SlashCommand

  if (command !== '/update-translations') {
    return res.status(400).json({ message: `Unknown slash command: ${command}` })
  }

  const url = `${ORIGIN_URL}/api/slack/update-translations-work`
  const data = { response_url }
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  setTimeout(() => {
    res.json({
      response_type: 'ephemeral',
      text: `Ok, you got it <@${user_id}>!`,
    })
  }, 100)
}

export default handler
