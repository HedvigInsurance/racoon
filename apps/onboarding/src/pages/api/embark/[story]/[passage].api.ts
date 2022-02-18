import type { NextApiRequest, NextApiResponse } from 'next'
import { fetchEmbarkStory, getEmbarkHistory, updateEmbarkHistory } from 'services/embark'

import { Embark } from 'embark-core'
import { getFormData } from '@/lib/get-form-data'

export const config = {
  api: {
    bodyParser: false,
  },
}

const submitUserInput = async (req: NextApiRequest, res: NextApiResponse) => {
  const storyName = req.query.story as string
  const passageName = req.query.passage as string

  try {
    const formFields = await getFormData(req)
    const history = getEmbarkHistory(req, res)
    const story = await fetchEmbarkStory(storyName)
    const newHistory = Embark.submitUserInput({
      story,
      history,
      input: {
        name: passageName,
        data: formFields,
      },
    })

    updateEmbarkHistory(req, res, newHistory)
    return res.json({ ok: true })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ form: 'Error' })
  }
}

export default submitUserInput
