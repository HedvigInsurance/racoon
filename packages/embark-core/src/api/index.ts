import { ActionInput, EmbarkHistory, HistoryItem, Store } from './types'
import { GraphQLVariable, GraphQLVariableType, Passage } from '@/shared/types'

import { JSONStory } from '@/angel/types'
import { PassageElement } from '@/shared/types'
import _get from 'lodash/get'
import _set from 'lodash/set'
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
  invariant(passage.action.type !== PassageElement.GraphQLAPI)
  let storeDiff = parseActionInput({ action: passage.action, input })

  console.log(JSON.stringify(storeDiff, null, 2))

  const currentStore = convertHistoryToStore(history)
  const nextStore = { ...currentStore, ...storeDiff }

  console.log(JSON.stringify(nextStore, null, 2))

  const nextPassageName = getActionLink({ action: passage.action, store: nextStore })
  if (nextPassageName) {
    const nextPassage = getPassage({ story, name: nextPassageName })
    if (nextPassage) {
      storeDiff = followRedirects({ story, store: nextStore, passage: nextPassage, storeDiff })
    }
  }

  const historyItem: HistoryItem = {
    storeDiff,
    passageName: passage.name,
  }

  return [...history.filter((item) => item.passageName !== historyItem.passageName), historyItem]
}

const generateUUID = () => {
  let d = new Date().getTime(),
    d2 = (performance && performance.now && performance.now() * 1000) || 0
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    let r = Math.random() * 16
    if (d > 0) {
      r = (d + r) % 16 | 0
      d = Math.floor(d / 16)
    } else {
      r = (d2 + r) % 16 | 0
      d2 = Math.floor(d2 / 16)
    }
    return (c == 'x' ? r : (r & 0x7) | 0x8).toString(16)
  })
}

type EvaluateVariablesParams = {
  history: EmbarkHistory
  variables: Array<GraphQLVariable>
}

const evaluateVariables = ({ history, variables }: EvaluateVariablesParams) => {
  const store = convertHistoryToStore(history)
  const variablesMap = {}

  for (const variable of variables) {
    const rawValue = _get(store, variable.from)
    if (rawValue !== undefined) {
      let value = rawValue

      if (variable.as === GraphQLVariableType.Boolean) {
        value = rawValue === 'true'
      }

      _set(variablesMap, variable.key, value)
    } else {
      console.log(`Could not find value for variable ${variable.key}`)
      console.log(JSON.stringify(store, null, 2))
    }
  }

  return {
    id: generateUUID(),
    ...variablesMap,
  }
}

type GetPassageParams = {
  story: JSONStory
  name: string
}

const getPassage = ({ story, name }: GetPassageParams) => {
  const rawPassage = angel.getPassageByName(story, name)
  if (rawPassage === undefined) return null
  return angel.parsePassage(rawPassage)
}

export const api = {
  fetchPassage,
  getPassage,
  submitUserInput,
  evaluateVariables,
}
