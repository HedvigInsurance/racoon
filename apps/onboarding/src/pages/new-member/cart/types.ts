type TableText =
  | { type: 'text'; text: string }
  | { type: 'translation'; key: string; variables: { [key: string]: string } }

type TableRow = {
  title: string
  value: TableText
}

export type Table = {
  rows: Array<TableRow>
}

type FieldBase = {
  label: string
  infoMessage?: string
  name: string
}

type StepperField = FieldBase & {
  type: 'stepper'
  min: number
  max: number
  step: number
  defaultValue: number
}

type RadioField = FieldBase & {
  type: 'radio'
  options: Array<{
    label: string
    value: string
    defaultChecked: boolean
  }>
}

type NumberField = FieldBase & {
  type: 'number'
  min?: number
  max?: number
  defaultValue: number
  suffix?: string
}

export type InputField = StepperField | RadioField | NumberField

export type Price = { amount: number; currency: string }
