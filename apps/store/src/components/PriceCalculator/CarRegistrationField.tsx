import { useState } from 'react'
import { TextField } from '@/components/TextField/TextField'
import { CarRegistrationNumberField as CarRegistrationNumberFieldType } from '@/services/PriceCalculator/Field.types'
import { useTranslateFieldLabel } from './useTranslateFieldLabel'

const CAR_REGISTRATION_NUMBER_REGEX = '[A-Za-z]{3} [0-9]{2}[A-Za-z0-9]{1}'
const CAR_REGISTRATION_NUMBER_LENGTH = 7

type RegistrationFieldProps = {
  field: CarRegistrationNumberFieldType
  autoFocus?: boolean
}

export const CarRegistrationNumberField = ({ field, autoFocus }: RegistrationFieldProps) => {
  const translateLabel = useTranslateFieldLabel()
  const [value, setValue] = useState<string>(field.value ?? field.defaultValue ?? '')

  const handleValueChange = (value: string) => {
    const maskedValue = value
      .replace(/\s/, '')
      .replace(/(\w{3})(\w{1,3})/, '$1 $2')
      .toUpperCase()

    setValue(maskedValue)
  }

  return (
    <TextField
      type="text"
      name={field.name}
      label={translateLabel(field.label)}
      pattern={CAR_REGISTRATION_NUMBER_REGEX}
      maxLength={CAR_REGISTRATION_NUMBER_LENGTH}
      required={field.required}
      value={value}
      defaultValue={field.defaultValue}
      onValueChange={handleValueChange}
      autoFocus={autoFocus}
    />
  )
}
