import { ClientPassage } from './types'
import { Passage } from '@/shared/types'
import { convertPassageAction } from './utils/convert-passage-action'

export const convertPassage = (passage: Passage): ClientPassage => {
  return {
    name: passage.name,
    messages: passage.messages.map(({ label }) => label),
    responses: passage.responses.map(({ label }) => label),
    action: passage.action ? convertPassageAction(passage.action) : undefined,
  }
}
