type InputBase = {
  name: string
  label: string
  placeholder?: string
  defaultValue?: string
}

type InputText = InputBase & { type: 'text' }
type InputNumber = InputBase & { type: 'number' }
type InputStepper = InputBase & { type: 'stepper' }
type InputSelect = InputBase & { type: 'select'; options: Array<{ name: string; value: string }> }
type InputEmail = InputBase & { type: 'email' }
type InputDate = InputBase & { type: 'date' }

export type Input = InputText | InputNumber | InputStepper | InputSelect | InputEmail | InputDate

export type InputGroup = {
  title: string
  inputs: Array<Input>
}

export type Form = {
  staticData: Array<Record<string, any>>
  inputGroups: Array<InputGroup>
}
