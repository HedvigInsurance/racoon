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
  GraphQLConstantVariable = 'ConstantVariable',
  GraphQLResult = 'Result',
  Error = 'Error',
  QuoteCartOfferRedirect = 'QuoteCartOfferRedirect',
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
  EQUAL = '==',
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

export type WhenCondition = {
  statements: Array<WhenStatement>
  operator: LogicalOperator
}

export type Redirect = {
  type: PassageElement.Redirect
  link: Link
  condition: WhenCondition
  key?: string
  value?: string
}

export type QuoteCartRedirect = {
  type: PassageElement.QuoteCartOfferRedirect
  id: string
  insuranceTypes: Array<string>
  condition: WhenCondition
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
  type: PassageElement.GraphQLVariable
  key: string
  from: string
  as: GraphQLVariableType
}

export type GraphQLConstantVariable = {
  type: PassageElement.GraphQLConstantVariable
  key: string
  value: string
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
  variables: Array<GraphQLVariable | GraphQLConstantVariable>
  requestType: GraphQLType
  document: string
  results: Array<GraphQLResult>
  errorLink?: Link
}

export type PassageAction = SelectAction | TextAction | TextActionSet | NumberAction | GraphQLAPI

export type PassageRedirect = Redirect | QuoteCartRedirect

export type Passage = {
  name: string
  messages: Array<Message>
  responses: Array<Message>
  action?: PassageAction
  redirects: Array<PassageRedirect>
}

export enum NumberOperator {
  Add = '+',
  Subtract = '-',
}

export type NumberExpression = {
  key: string
  operator: NumberOperator
  value: number
}

export type ComputedValue = {
  key: string
  expression: NumberExpression
}
