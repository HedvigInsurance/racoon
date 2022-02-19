import { ActionInput, EmbarkHistory, HistoryItem, Store } from './types'

import { JSONStory } from '@/angel/types'
import { Passage } from '@/shared/types'
import { angel } from '../angel'
import { convertHistoryToStore } from './utils/convert-history-to-store'
import { convertPassage } from './convert'
import { followRedirects } from './utils/follow-redirects'
import { getActionLink } from './utils/get-action-link'
import { getRedirectLink } from './utils/get-redirect-link'
import invariant from 'tiny-invariant'
import { parseActionInput } from './utils/parse-action-input'

type FetchPassageParams = {
  story: JSONStory
  history: EmbarkHistory
}

type GetNextPassageParams = {
  story: JSONStory
  store: Store
  passage: Passage
  prevPassage?: Passage
}

const getNextPassage = ({
  story,
  store,
  passage,
  prevPassage,
}: GetNextPassageParams): Passage | null => {
  let passageName = getRedirectLink(store, passage.redirects)

  // no more redirects
  if (!passageName && prevPassage) return passage

  if (!passageName && passage.action) {
    // try to get next passage from action
    passageName = getActionLink({ action: passage.action, store })
  }

  if (!passageName) {
    // passage is the last one
    return null
  }

  const passageOrUndefined = angel.getPassageByName(story, passageName)
  invariant(passageOrUndefined !== undefined, 'Could not determine next passage')
  const nextPassage = angel.parsePassage(passageOrUndefined)

  return getNextPassage({
    story,
    store,
    passage: nextPassage,
    prevPassage: passage,
  })
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

      const nextPassage = getNextPassage({ story, store, passage: lastPassage })

      if (nextPassage === null) {
        // Last passage was the last one
        return null
      }

      passage = nextPassage
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
  const actionStoreDiff = parseActionInput({ action: passage.action, input })

  const store = convertHistoryToStore(history)
  const storeDiff = followRedirects({ story, store, passage, storeDiff: actionStoreDiff })

  const historyItem: HistoryItem = {
    storeDiff,
    passageName: passage.name,
  }

  return [...history.filter((item) => item.passageName !== historyItem.passageName), historyItem]
}

export const api = {
  fetchPassage,
  submitUserInput,
}
