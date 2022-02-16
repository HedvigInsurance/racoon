export enum PassageElement {
  Message = 'Message',
  Response = 'Response',
  SelectAction = 'SelectAction',
  SelectActionOption = 'Option',
  TextAction = 'TextAction',
  TextActionSet = 'TextActionSet',
  NumberAction = 'NumberAction',
}

type Placeholder = { key: string; pattern: string }

export type TextLabel = { text: string; placeholders?: Array<Placeholder> }

export type Message = {
  label: TextLabel
}

export type Link = {
  label: TextLabel
  to: string
}

type SelectActionOption = {
  key: string
  value: string
  link: Link
}

export type SelectAction = {
  type: PassageElement.SelectAction
  options: Array<SelectActionOption>
}

export type BaseTextAction = {
  type: PassageElement.TextAction

  key: string
  title: TextLabel
  size: 'small' | 'large'

  placeholder?: TextLabel
  mask?: string
  unit?: TextLabel
}

export type TextAction = BaseTextAction & {
  link: Link
}

export type TextActionSet = {
  type: PassageElement.TextActionSet
  link: Link
  actions: Array<BaseTextAction>
}

export type NumberAction = {
  type: PassageElement.NumberAction

  key: string
  link: Link
  unit: TextLabel

  placeholder?: TextLabel
  minValue?: number
}

export type PassageAction = SelectAction | TextAction | TextActionSet | NumberAction

export type Passage = {
  name: string
  messages: Array<Message>
  responses: Array<Message>
  action?: PassageAction
}
