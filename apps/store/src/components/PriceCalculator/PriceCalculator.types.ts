type Placeholder = { key: string; pattern: string }
export type TextLabel = { key: string; placeholders?: Array<Placeholder> }

type InputBase = {
  name: string
  label: TextLabel
  placeholder?: TextLabel
  defaultValue?: string
  required?: boolean

  columnSpan?: number
}

type InputText = InputBase & { type: 'text'; pattern?: string }
type InputNumber = InputBase & { type: 'number'; min?: number; max?: number }
type InputSelect = InputBase & {
  type: 'select'
  options: Array<{ name: TextLabel; value: string }>
}
type InputDate = InputBase & { type: 'date' }
type InputRadio = InputBase & { type: 'radio'; options: Array<{ label: TextLabel; value: string }> }

export type Input = InputText | InputNumber | InputSelect | InputDate | InputRadio

type InputGroupState = 'IDLE' | 'INVALID' | 'VALID'

export type GroupSummary = {
  labels: Array<TextLabel>
}

export type InputGroup = {
  id: string
  title: TextLabel
  inputs: Array<Input>
  state: InputGroupState
  summary: GroupSummary
}

export type PriceForm = {
  groups: Array<InputGroup>
}
