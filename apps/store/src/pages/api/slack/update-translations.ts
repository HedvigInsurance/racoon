import { type NextApiRequest, type NextApiResponse } from 'next'

const OWNER = 'HedvigInsurance'
const REPO = 'racoon'
const WORKFLOW_ID = 'download-translations.yml'
const BRANCH = 'main'

type SlashCommand = {
  command: string
  response_url: string
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  if (req.query.secret !== process.env.SLACK_SECRET) {
    return res.status(401).json({ message: 'Invalid token' })
  }

  const data = req.body as SlashCommand

  if (data.command !== '/update-translations') {
    return res.status(400).json({ message: `Unknown slash command: ${data.command}` })
  }

  const response = await fetch(
    `https://api.github.com/repos/${OWNER}/${REPO}/actions/workflows/${WORKFLOW_ID}/dispatches`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
      body: JSON.stringify({ ref: BRANCH }),
    },
  )

  let message: string
  if (!response.ok) {
    console.warn('Failed to trigger workflow', response.status, response.statusText)
    message = 'Sorry, something went wrong... :('
  } else {
    message = 'Ok, I will update the translations!'
  }

  await fetch(data.response_url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text: message }),
  })

  return res.end()
}

export default handler
