import { type NextApiHandler } from 'next'
import { createTrial, getPartner, getTrialData } from '@/features/widget/debuggerTrialCreate'
import { ORIGIN_URL } from '@/utils/PageLink'

const LOCAL_URL = new URL(ORIGIN_URL)

const handler: NextApiHandler = async (req, res) => {
  const partner = getPartner(req.body)
  const data = getTrialData(req.body)

  try {
    const { fullUrl } = await createTrial(partner, data)

    const nextURL = new URL(fullUrl)
    nextURL.hostname = LOCAL_URL.hostname
    nextURL.port = LOCAL_URL.port
    nextURL.protocol = LOCAL_URL.protocol

    res.redirect(303, nextURL.toString())
  } catch (error) {
    res.status(500).send(error instanceof Error ? error.message : 'Unknown error')
  }
}

export default handler
