import { ActionInput, EmbarkHistory, HistoryItem } from './types'

import { JSONStory } from '@/angel/types'
import { Passage } from '@/shared/types'
import { angel } from '../angel'
import { convertHistoryToStore } from './utils/convert-history-to-store'
import { convertPassage } from './convert'
import { getActionLink } from './utils/get-action-link'
import invariant from 'tiny-invariant'
import { parseActionInput } from './utils/parse-action-input'

type FetchPassageParams = {
  story: JSONStory
  history: EmbarkHistory
}

const fetchPassage = ({ story, history }: FetchPassageParams) => {
  let passage: Passage

  if (history.length === 0) {
    // Get start (initial) passage
    const startPassage = angel.getStartPassage(story)
    passage = angel.parsePassage(startPassage)
  } else {
    const lastHistoryItem = history[history.length - 1]
    const lastPassageName = lastHistoryItem.passageName

    const rawLastPassage = angel.getPassageByName(story, lastPassageName)
    invariant(rawLastPassage !== undefined, 'Could not find passage')
    const lastPassage = angel.parsePassage(rawLastPassage)

    if (lastPassage.action) {
      const store = convertHistoryToStore(history)
      // Get next passage from action
      const passageName = getActionLink({ action: lastPassage.action, store })

      const passageOrUndefined = angel.getPassageByName(story, passageName)
      invariant(passageOrUndefined !== undefined, 'Could not determine next passage')
      passage = angel.parsePassage(passageOrUndefined)
    } else {
      // Get next passage from (redirect)
      const startPassage = angel.getStartPassage(story)
      passage = angel.parsePassage(startPassage)
    }
  }

  return convertPassage(passage)
}

type SubmitUserInputParams = {
  story: JSONStory
  history: EmbarkHistory
  input: ActionInput
}

const submitUserInput = ({ story, history, input }: SubmitUserInputParams) => {
  const rawPassage = angel.getPassageByName(story, input.name)
  invariant(rawPassage !== undefined, 'Could not find current passage')
  const passage = angel.parsePassage(rawPassage)

  invariant(passage.action !== undefined, 'Passage does not have an action')
  const storeDiff = parseActionInput({ action: passage.action, input })

  const historyItem: HistoryItem = {
    storeDiff,
    passageName: passage.name,
  }

  return [...history.filter((item) => item.passageName !== input.name), historyItem]
}

export const api = {
  fetchPassage,
  submitUserInput,
}
