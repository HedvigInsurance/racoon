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

export type InputField = StepperField | RadioField
