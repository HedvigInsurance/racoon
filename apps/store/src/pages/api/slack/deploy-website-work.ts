import { type NextApiRequest, type NextApiResponse } from 'next'

const DEPLOY_HOOK = process.env.VERCEL_DEPLOY_HOOK

if (DEPLOY_HOOK === undefined) throw new Error('Missing Vercel deploy hook')

type VercelDeployHookResponse = {
  job: {
    createdAt: number
  }
}

type Data = {
  responseUrl: string
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { responseUrl } = req.body as Data

  console.info('Triggering Vercel deploy')
  const { ok } = await triggerVercelDeploy(DEPLOY_HOOK)

  if (ok) {
    await sendEphemeralMessage(responseUrl, '🔧 Website deploy triggered')
    await sendEphemeralMessage(responseUrl, "💁🏻‍♂️ Will post in <#C0474TE1V25> when it's ready")
  } else {
    await sendEphemeralMessage(responseUrl, '❌ Sorry, not able to trigger a deploy...')
  }

  res.end('ok')
}

const triggerVercelDeploy = async (url: string) => {
  const response = await fetch(url, { method: 'POST' })

  if (!response.ok) {
    console.warn('Failed to trigger Vercel deploy', response.status, response.statusText)
    return { ok: false, createdAt: undefined }
  } else {
    const data = (await response.json()) as VercelDeployHookResponse
    console.info(`Vercel deploy triggered: ${data.job.createdAt}`)
    return { ok: true, ...data.job }
  }
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
