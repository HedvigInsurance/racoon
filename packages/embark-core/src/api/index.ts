import { ActionInput, EmbarkHistory, Store } from './types'
import {
  GraphQLConstantVariable,
  GraphQLVariable,
  GraphQLVariableType,
  Passage,
} from '@/shared/types'

import { JSONStory } from '@/angel/types'
import { PassageElement } from '@/shared/types'
import _get from 'lodash/get'
import _set from 'lodash/set'
import { angel } from '@/angel/index'
import { computeStore } from './utils/compute-store'
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
      const store = computeStore({ story, history })

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

  const actionStoreDiff = parseActionInput({ action: passage.action, input })

  const tempHistoryItem = { storeDiff: actionStoreDiff, passageName: passage.name }
  const nextHistory = [
    ...history.filter((item) => item.passageName !== tempHistoryItem.passageName),
    tempHistoryItem,
  ]
  const nextStore = computeStore({ story, history: nextHistory })

  let combinedStoreDiff: Store = {}
  const nextPassageName = getActionLink({ action: passage.action, store: nextStore })
  if (nextPassageName) {
    const nextPassage = getPassage({ story, name: nextPassageName })
    if (nextPassage) {
      combinedStoreDiff = followRedirects({
        story,
        store: nextStore,
        passage: nextPassage,
        storeDiff: actionStoreDiff,
      })
    }
  }

  const historyItem = { ...tempHistoryItem, storeDiff: combinedStoreDiff }
  return [...history.filter((item) => item.passageName !== historyItem.passageName), historyItem]
}

type EvaluateVariablesParams = {
  story: JSONStory
  history: EmbarkHistory
  variables: Array<GraphQLVariable | GraphQLConstantVariable>
}

const evaluateVariables = ({ story, history, variables }: EvaluateVariablesParams) => {
  const store = computeStore({ story, history })
  const variablesMap = {}

  for (const variable of variables) {
    if (variable.type === PassageElement.GraphQLVariable) {
      const rawValue = _get(store, variable.from)
      if (rawValue !== undefined) {
        let value = rawValue

        if (variable.as === GraphQLVariableType.Boolean) {
          value = rawValue === 'true'
        }

        _set(variablesMap, variable.key, value)
      } else {
        console.log(`Could not find value for variable ${variable.from}`)
        console.log(JSON.stringify(store, null, 2))
      }
    } else {
      _set(variablesMap, variable.key, variable.value)
    }
  }

  return {
    quoteCartId: '866ba7de-5d90-4f13-826b-a2cc6c04dcd6',
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
