import { type NextApiRequest, type NextApiResponse } from 'next'

const OWNER = 'HedvigInsurance'
const REPO = 'racoon'
const WORKFLOW_ID = 'download-translations.yml'
const BRANCH = 'main'

type Data = {
  response_url: string
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { response_url } = req.body as Data

  const ok = await triggerUpdateTranslationsWorkflow()
  const message = ok ? 'Ok, I triggered the workflow!' : 'Sorry, something went wrong... :('
  await sendEphemeralMessage(response_url, message)

  res.end('ok')
}

// Docs: https://docs.github.com/en/rest/actions/workflows?apiVersion=2022-11-28#create-a-workflow-dispatch-event
const triggerUpdateTranslationsWorkflow = async () => {
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

  if (!response.ok) {
    console.warn('Failed to trigger workflow', response.status, response.statusText)
  }

  return response.ok
}

const sendEphemeralMessage = async (responseURL: string, message: string) => {
  await fetch(responseURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      response_type: 'ephemeral',
      text: message,
    }),
  })
}

export default handler
