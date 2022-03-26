import { PassageElement } from 'embark-core'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getFormData } from '@/lib/get-form-data'
import { initializeApollo } from '@/services/apollo'
import { Embark } from '@/services/embark'

export const config = { api: { bodyParser: false } }

const submitUserInput = async (req: NextApiRequest, res: NextApiResponse) => {
  const storyName = req.query.story as string
  const passageName = req.query.passage as string

  try {
    const formFields = await getFormData(req)
    const history = Embark.history(req, res)
    const story = await Embark.story(storyName)

    const client = initializeApollo()
    const passage = Embark.passage({ story, name: passageName })

    if (passage === null) {
      return res.status(404).json({ error: 'Passage not found' })
    }

    if (passage.action === undefined) {
      return res.status(500).json({ error: 'Passage does not have an action' })
    }

    if (passage.action.type === PassageElement.GraphQLAPI) {
      const newHistory = await Embark.runMutation({
        client,
        story,
        history,
        passage,
        action: passage.action,
      })
      Embark.save(req, res, newHistory)
    } else {
      const newHistory = Embark.submit({
        story,
        history,
        input: {
          name: passageName,
          data: formFields,
        },
      })

      Embark.save(req, res, newHistory)
    }

    return res.json({ ok: true })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ form: 'Error' })
  }
}

export default submitUserInput
