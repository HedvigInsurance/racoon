type Placeholder = { key: string; pattern: string }
export type TextLabel = { key: string; placeholders?: Array<Placeholder> }

export type UISchema = {
  layout: Layout
  fields: Record<string, FieldConfig | undefined>
}

type Layout = {
  groups: Array<LayoutGroup>
}

type LayoutGroup = {
  id: string
  title: TextLabel
  items: Array<LayoutItem>
  cta: TextLabel
}

type LayoutItem = {
  field: string
  columnSpan?: number
}

type FieldConfig = {
  title?: TextLabel
  widget?: 'date' | 'stepper' | 'select' | 'radio' | 'text'
  options?: Array<{ label: TextLabel; value: string }>
  required?: boolean
  defaultValue?: unknown
}

type InputBase = {
  name: string
  label: TextLabel
  placeholder?: TextLabel
  defaultValue?: unknown
  required?: boolean

  columnSpan?: number
}

type InputText = InputBase & { type: 'text'; pattern?: string }
type InputNumber = InputBase & { type: 'number'; min?: number; max?: number }
type InputSelect = InputBase & {
  type: 'select'
  options: Array<{ label: TextLabel; value: string }>
}
type InputDate = InputBase & { type: 'date' }
type InputRadio = InputBase & { type: 'radio'; options: Array<{ label: TextLabel; value: string }> }

export type Input = InputText | InputNumber | InputSelect | InputDate | InputRadio

type InputGroupState = 'INITIAL' | 'INVALID' | 'VALID'

export type InputGroup = {
  id: string
  title: TextLabel
  cta: TextLabel
  inputs: Array<Input>
  state: InputGroupState
}

export type FormTemplate = {
  groups: Array<InputGroup>
}
