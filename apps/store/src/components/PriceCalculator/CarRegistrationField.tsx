import { useState } from 'react'
import { TextField } from '@/components/TextField/TextField'
import { CarRegistrationNumberField as CarRegistrationNumberFieldType } from '@/services/PriceCalculator/Field.types'
import { useTranslateFieldLabel } from './useTranslateFieldLabel'

const CAR_REGISTRATION_NUMBER_REGEX = '[A-Za-z]{3} [0-9]{2}[A-Za-z0-9]{1}'
const CAR_REGISTRATION_NUMBER_LENGTH = 7

type RegistrationFieldProps = {
  field: CarRegistrationNumberFieldType
}

export const CarRegistrationNumberField = ({ field }: RegistrationFieldProps) => {
  const translateLabel = useTranslateFieldLabel()
  const [value, setValue] = useState<string>(maskValue(field.value ?? field.defaultValue ?? ''))

  const handleValueChange = (value: string) => {
    const maskedValue = value
      .replace(/\s/, '')
      .replace(/(\w{3})(\w{1,3})/, '$1 $2')
      .toUpperCase()

    setValue(maskedValue)
  }

  const baseProps = {
    type: 'text',
    required: field.required,
    pattern: CAR_REGISTRATION_NUMBER_REGEX,
    maxLength: CAR_REGISTRATION_NUMBER_LENGTH,
  }

  const noWhitespaceValue = value.replace(/\s/, '')

  return (
    <>
      <input {...baseProps} name={field.name} value={noWhitespaceValue} readOnly hidden />

      <TextField
        {...baseProps}
        name={undefined}
        label={translateLabel(field.label)}
        value={value}
        onValueChange={handleValueChange}
      />
    </>
  )
}

const maskValue = (value: string) => {
  return value
    .replace(/\s/, '')
    .replace(/(\w{3})(\w{1,3})/, '$1 $2')
    .toUpperCase()
}
