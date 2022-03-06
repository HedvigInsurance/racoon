import {
  BaseTextAction,
  GraphQLAPI,
  NumberAction,
  PassageElement,
  QuoteCartRedirect,
  TextAction,
  TextActionSet,
  TextLabel,
} from '@/shared/types'

type ClientSelectActionOption = {
  label: TextLabel
  value: string
}

export type ClientSelectAction = {
  type: PassageElement.SelectAction
  options: Array<ClientSelectActionOption>
}

export type ClientTextAction = Omit<TextAction, 'key' | 'link'>

export type ClientTextActionSet = Omit<TextActionSet, 'actions' | 'link'> & {
  actions: Array<BaseTextAction>
}

export type ClientNumberAction = Omit<NumberAction, 'key' | 'link'>

export type ClientGraphQLAction = Pick<GraphQLAPI, 'type' | 'variables' | 'document'>

export type ClientQuoteCartRedirect = Pick<QuoteCartRedirect, 'type' | 'id' | 'insuranceTypes'>

export type ClientAction =
  | ClientSelectAction
  | ClientTextAction
  | ClientTextActionSet
  | ClientNumberAction
  | ClientGraphQLAction
  | ClientQuoteCartRedirect

export type ClientPassage = {
  name: string
  messages: Array<TextLabel>
  responses: Array<TextLabel>
  action?: ClientAction
}

export type ActionInput = {
  name: string
  data: Record<string, unknown>
}

export type Store = Record<string, unknown>

export type HistoryItem = {
  passageName: string
  storeDiff: Store
}

export type EmbarkHistory = Array<HistoryItem>
