import { Label } from './PriceCalculator.types'

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
  inputMode?: 'text' | 'numeric' | 'tel' | 'email'
  inputType?: 'text' | 'tel' | 'email'
}

export type NumberField = BaseField<number> & {
  type: 'number'
  min?: number
  max?: number
  suffix?: string
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

export type CarRegistrationNumberField = BaseField<string> & {
  type: 'car-registration-number'
}

export type CarMileageField = BaseField<string> & {
  type: 'car-mileage'
}

export type CurrentInsuranceField = BaseField<string> & {
  type: 'current-insurance'
}

export type StepperField = BaseField<number> & {
  type: 'stepper'
  min?: number
  max: number
  valueLabel: Label
}

export type InputField =
  | TextField
  | NumberField
  | DateField
  | RadioField
  | SelectField
  | ExtraBuildingsField
  | CarRegistrationNumberField
  | CarMileageField
  | CurrentInsuranceField
  | StepperField
