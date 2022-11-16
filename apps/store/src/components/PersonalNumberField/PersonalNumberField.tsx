import Personnummer from 'personnummer'
import { ChangeEventHandler, useState } from 'react'
import { InputField, InputFieldProps } from 'ui'

type Props = Omit<InputFieldProps, 'suffix'>

/**
 * Personal Number input field.
 * Only supports Swedish personal numbers.
 */
export const PersonalNumberField = (props: Props) => {
  const { value: propValue, defaultValue, label, infoMessage, errorMessage, ...baseProps } = props

  const [value, setValue] = useState(() => {
    if (typeof propValue === 'string') return propValue
    if (typeof defaultValue === 'string') return defaultValue
    return ''
  })

  const handleOnChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    let value = event.target.value

    if (Personnummer.valid(value)) {
      value = Personnummer.parse(value).format(true)
    }
    setValue(value)
  }

  return (
    <>
      <input {...baseProps} type="text" value={value} readOnly hidden />
      <InputField
        {...baseProps}
        type="text"
        name={`${props.name}-visible-input`}
        label={label}
        infoMessage={infoMessage}
        errorMessage={errorMessage}
        minLength={10}
        maxLength={13}
        value={value}
        onChange={handleOnChange}
      />
    </>
  )
}
