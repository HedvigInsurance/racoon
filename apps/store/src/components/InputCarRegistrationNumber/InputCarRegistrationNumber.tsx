import type { InputHTMLAttributes } from 'react'
import { useState } from 'react'
import { TextField } from '@/components/TextField/TextField'

const CAR_REGISTRATION_NUMBER_REGEX = '[A-Za-z]{3} [0-9]{2}[A-Za-z0-9]{1}'
const CAR_REGISTRATION_NUMBER_LENGTH = 7

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'children' | 'value' | 'defaultValue'> & {
  label: string
  value?: string
  defaultValue?: string
}

export const InputCarRegistrationNumber = (props: Props) => {
  const [value, setValue] = useState<string>(maskValue(props.value ?? props.defaultValue ?? ''))

  const handleValueChange = (value: string) => {
    const maskedValue = value
      .replace(/\s/, '')
      .replace(/(\w{3})(\w{1,3})/, '$1 $2')
      .toUpperCase()

    setValue(maskedValue)
  }

  const baseProps = {
    type: 'text',
    required: props.required,
    pattern: CAR_REGISTRATION_NUMBER_REGEX,
    maxLength: CAR_REGISTRATION_NUMBER_LENGTH,
  }

  const noWhitespaceValue = value.replace(/\s/, '')

  return (
    <>
      <input
        {...baseProps}
        name={props.name}
        value={noWhitespaceValue}
        readOnly={true}
        hidden={true}
      />

      <TextField
        {...baseProps}
        label={props.label}
        value={value}
        onValueChange={handleValueChange}
        autoFocus={props.autoFocus}
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
