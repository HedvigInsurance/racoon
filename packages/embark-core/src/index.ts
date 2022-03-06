import { api } from './api'

export type {
  EmbarkHistory,
  ClientPassage,
  ClientAction,
  ClientSelectAction,
  ClientTextAction,
  ClientNumberAction,
  ClientTextActionSet,
  ClientGraphQLAction,
} from './api/types'
export type { JSONStory } from '@/angel/types'
export type { TextLabel } from '@/shared/types'
export { PassageElement } from '@/shared/types'

export const Embark = {
  ...api,
}
