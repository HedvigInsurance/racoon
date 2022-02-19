export enum PassageElement {
  Message = 'Message',
  Response = 'Response',
  SelectAction = 'SelectAction',
  SelectActionOption = 'Option',
  TextAction = 'TextAction',
  TextActionSet = 'TextActionSet',
  NumberAction = 'NumberAction',
  Redirect = 'Redirect',
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

export enum WhenOperator {
  GREATER_THAN = '>',
  LESS_THAN = '<',
  EQUAL = '=',
  PASS = 'PASS',
}

export enum LogicalOperator {
  AND = '&&',
  OR = '||',
}

export type WhenStatement =
  | {
      key: string
      value: string
      operator: WhenOperator
    }
  | {
      operator: WhenOperator.PASS
    }

export type Redirect = {
  link: Link
  conditions: Array<WhenStatement>
  logicalOperator: LogicalOperator
  key?: string
  value?: string
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

export enum TextActionMask {
  PersonalNumber = 'PersonalNumber',
  BirthDate = 'BirthDate',
  BirthDateReverse = 'BirthDateReverse',
}

export type BaseTextAction = {
  type: PassageElement.TextAction

  key: string
  title: TextLabel
  size: 'small' | 'large'

  placeholder?: TextLabel
  mask?: TextActionMask
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
  redirects: Array<Redirect>
}
