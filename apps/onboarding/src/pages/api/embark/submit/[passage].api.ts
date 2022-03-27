import { PassageElement } from 'embark-core'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getFormData } from '@/lib/get-form-data'
import { initializeApollo } from '@/services/apollo'
import * as Embark from '@/services/embark/embark'

export const config = { api: { bodyParser: false } }

const postEmbarkSubmitPassage = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = Embark.Persistence.get({ req, res })
  if (session === null) throw new Error('Session not found')
  const passageName = req.query.passage as string

  try {
    const formFields = await getFormData(req)
    const story = await Embark.story(session.story)

    const client = initializeApollo()
    const passage = Embark.passage({ story, name: passageName })

    if (passage === null) {
      return res.status(404).json({ error: 'Passage not found' })
    }

    if (passage.action === undefined) {
      return res.status(500).json({ error: 'Passage does not have an action' })
    }

    if (passage.action.type === PassageElement.GraphQLAPI) {
      session.history = await Embark.runMutation({
        client,
        story,
        history: session.history,
        passage,
        action: passage.action,
      })
    } else {
      session.history = Embark.submit({
        story,
        history: session.history,
        input: {
          name: passageName,
          data: formFields,
        },
      })
    }

    Embark.Persistence.save({ req, res, session })
    return res.json({ ok: true })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ form: 'Error' })
  }
}

export default postEmbarkSubmitPassage
