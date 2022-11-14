import { Label } from './PriceForm.types'

type BaseField<ValueType> = {
  name: string
  label: Label
  required?: boolean
  value?: ValueType
  defaultValue?: ValueType
}

export type TextField = BaseField<string> & {
  type: 'text'
  pattern?: string
  minLength?: number
  maxLength?: number
}

export type SsnSeField = BaseField<string> & {
  type: 'ssn-se'
}

export type NumberField = BaseField<number> & {
  type: 'number'
  min?: number
  max?: number
}

export type DateField = BaseField<string> & {
  type: 'date'
  min?: string
  max?: string
}

type RadioField = BaseField<string> & {
  type: 'radio'
  options: Array<FieldOption>
}

export type FieldOption = {
  label: Label
  value: string
}

type SelectField = BaseField<string> & {
  type: 'select'
  options: Array<FieldOption>
}

export type ExtraBuildingsField = BaseField<Array<ExtraBuilding>> & {
  type: 'extra-buildings'
  buildingOptions: Array<FieldOption>
}

export type ExtraBuilding = { area: number; type: string; hasWaterConnected: boolean }

export type HouseholdSizeField = BaseField<number> & {
  type: 'householdSize'
  max: number
}

export type RegistrationField = BaseField<string> & {
  type: 'registration-number'
}

export type InputField =
  | TextField
  | NumberField
  | DateField
  | RadioField
  | SelectField
  | ExtraBuildingsField
  | HouseholdSizeField
  | SsnSeField
  | RegistrationField
