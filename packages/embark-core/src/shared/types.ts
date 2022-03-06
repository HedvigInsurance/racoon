export enum PassageElement {
  Message = 'Message',
  Response = 'Response',
  SelectAction = 'SelectAction',
  SelectActionOption = 'Option',
  TextAction = 'TextAction',
  TextActionSet = 'TextActionSet',
  NumberAction = 'NumberAction',
  Redirect = 'Redirect',
  Tooltip = 'Tooltip',
  TooltipTitle = 'Title',
  TooltipDescription = 'Description',
  GraphQLAPI = 'GraphQLApi',
  GraphQLQuery = 'Query',
  GraphQLMutation = 'Mutation',
  GraphQLVariable = 'Variable',
  GraphQLResult = 'Result',
  Error = 'Error',
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

export type Tooltip = {
  title: TextLabel
  description: TextLabel
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
  tooltip?: Tooltip
}

export enum GraphQLVariableType {
  String = 'string',
  Int = 'int',
  Boolean = 'boolean',
}

export type GraphQLVariable = {
  key: string
  from: string
  as: GraphQLVariableType
}

export type GraphQLType = PassageElement.GraphQLQuery | PassageElement.GraphQLMutation

export type GraphQLResult = {
  key: string
  as: string
}

export type GraphQLAPI = {
  type: PassageElement.GraphQLAPI
  link: Link
  variables: Array<GraphQLVariable>
  requestType: GraphQLType
  document: string
  results: Array<GraphQLResult>
  errorLink?: Link
}

export type PassageAction = SelectAction | TextAction | TextActionSet | NumberAction | GraphQLAPI

export type Passage = {
  name: string
  messages: Array<Message>
  responses: Array<Message>
  action?: PassageAction
  redirects: Array<Redirect>
}
