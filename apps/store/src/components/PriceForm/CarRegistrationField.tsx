import { ChangeEventHandler, useState } from 'react'
import { InputField } from 'ui'
import { CarRegistrationNumberField as CarRegistrationNumberFieldType } from '@/services/PriceForm/Field.types'
import { useTranslateTextLabel } from './useTranslateTextLabel'

const CAR_REGISTRATION_NUMBER_REGEX = '[A-Za-z]{3} [0-9]{2}[A-Za-z0-9]{1}'

type RegistrationFieldProps = {
  field: CarRegistrationNumberFieldType
}

export const CarRegistrationNumberField = ({ field }: RegistrationFieldProps) => {
  const translateLabel = useTranslateTextLabel({ data: {} })
  const [value, setValue] = useState<string>(field.value ?? field.defaultValue ?? '')
  const handleOnChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const { value } = event.target

    const maskedValue = value
      .replace(/\s/, '')
      .replace(/(\w{3})(\w{1,3})/, '$1 $2')
      .toUpperCase()

    setValue(maskedValue)
  }

  return (
    <>
      <input
        type="text"
        name={field.name}
        required={field.required}
        value={value}
        readOnly
        hidden
      />
      <InputField
        type="text"
        name={`${field.name}-visible-input`}
        label={field.label ? translateLabel(field.label) : undefined}
        pattern={CAR_REGISTRATION_NUMBER_REGEX}
        placeholder="ABC 123"
        minLength={6}
        maxLength={7}
        required={field.required}
        value={value}
        defaultValue={field.defaultValue}
        onChange={handleOnChange}
      />
    </>
  )
}
