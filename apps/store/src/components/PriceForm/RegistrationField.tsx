import { ChangeEventHandler, useState } from 'react'
import { InputField } from 'ui'
import { RegistrationField as RegistrationFieldType } from '@/services/PriceForm/Field.types'
import { useTranslateTextLabel } from './useTranslateTextLabel'

type RegistrationFieldProps = {
  field: RegistrationFieldType
}

export const RegistrationField = ({ field }: RegistrationFieldProps) => {
  const translateLabel = useTranslateTextLabel({ data: {} })
  const [value, setValue] = useState<string>(field.value ?? field.defaultValue ?? '')
  const [unmaskedValue, setUnmaskedValue] = useState('')
  const handleOnChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const { value } = event.target

    const maskedValue = value
      .replace(/\s/, '')
      .replace(/(\w{3})(\w{1,3})/, '$1 $2')
      .toUpperCase()

    setUnmaskedValue(value.replace(/\s/, ''))
    setValue(maskedValue)
  }

  return (
    <>
      <input
        type="text"
        name={field.name}
        required={field.required}
        value={unmaskedValue}
        readOnly
        hidden
      />
      <InputField
        type="text"
        name={`${field.name}-visible-input`}
        label={field.label ? translateLabel(field.label) : undefined}
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
