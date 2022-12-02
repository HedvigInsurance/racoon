import Personnummer from 'personnummer'
import { ChangeEventHandler, InputHTMLAttributes, useState } from 'react'
import { TextField } from '../TextField/TextField'

type Props = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag'
>

/**
 * Personal Number input field.
 * Only supports Swedish personal numbers.
 */
export const PersonalNumberField = (props: Props) => {
  const { value: propValue, defaultValue, ...baseProps } = props

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

      <TextField
        {...baseProps}
        type="text"
        name={undefined}
        inputMode="numeric"
        minLength={10}
        maxLength={13}
        pattern="[0-9-+]"
        onChange={handleOnChange}
      />
    </>
  )
}
