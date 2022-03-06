import { Embark, PassageElement } from 'embark-core'
import type { NextApiRequest, NextApiResponse } from 'next'
import {
  fetchEmbarkStory,
  getEmbarkHistory,
  runMutation,
  updateEmbarkHistory,
} from 'services/embark'

import { getFormData } from '@/lib/get-form-data'
import { initializeApollo } from '@/services/apollo'

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

    const client = initializeApollo()
    const passage = Embark.getPassage({ story, name: passageName })

    if (passage === null) {
      return res.status(404).json({ error: 'Passage not found' })
    }

    if (passage.action === undefined) {
      return res.status(500).json({ error: 'Passage does not have an action' })
    }

    if (passage.action.type === PassageElement.GraphQLAPI) {
      const newHistory = await runMutation({
        client,
        story,
        history,
        passage,
        action: passage.action,
      })
      updateEmbarkHistory(req, res, newHistory)
    } else {
      const newHistory = Embark.submitUserInput({
        story,
        history,
        input: {
          name: passageName,
          data: formFields,
        },
      })

      updateEmbarkHistory(req, res, newHistory)
    }

    return res.json({ ok: true })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ form: 'Error' })
  }
}

export default submitUserInput
