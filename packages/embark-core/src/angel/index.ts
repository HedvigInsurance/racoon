import type { JSONStory } from './types'
import invariant from 'tiny-invariant'
import { parseComputedValues } from './utils/parse-computed-values'
import { parsePassage } from './parse'

const getStartPassage = (story: JSONStory) => {
  const passage = story.passages.find((passage) => passage.id === story.startPassage)
  invariant(passage !== undefined, "Couldn't find start passage")
  return passage
}

const getPassage = (story: JSONStory, id: string) => {
  return story.passages.find((passage) => passage.id === id)
}

const getPassageByName = (story: JSONStory, name: string) => {
  return story.passages.find((passage) => passage.name === name)
}

export const angel = {
  getStartPassage,
  parsePassage,
  getPassage,
  getPassageByName,
  parseComputedValues,
}
