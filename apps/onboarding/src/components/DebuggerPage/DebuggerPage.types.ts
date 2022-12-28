type InputBase = {
  name: string
  label: string
  placeholder?: string
  defaultValue?: string
}

type InputText = InputBase & { type: 'text' }
type InputNumber = InputBase & { type: 'number' }
type InputSelect = InputBase & { type: 'select'; options: Array<{ name: string; value: string }> }
type InputEmail = InputBase & { type: 'email' }
type InputDate = InputBase & { type: 'date' }

export type Input = InputText | InputNumber | InputSelect | InputEmail | InputDate

export type InputGroup = {
  title: string
  inputs: Array<Input>
}

export type Form = {
  staticData: Array<Record<string, any>>
  inputGroups: Array<InputGroup>
}
