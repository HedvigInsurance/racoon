import Personnummer from 'personnummer'
import { InputHTMLAttributes, useState } from 'react'
import { TextField, Props as TextFieldProps } from '@/components/TextField/TextField'

export type Props = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag'
> & {
  label: string
  warning?: boolean
  message?: string
} & Pick<TextFieldProps, 'onClear'>

/**
 * Personal Number input field.
 * Only supports Swedish personal numbers.
 */
export const PersonalNumberField = (props: Props) => {
  const { value: propValue, defaultValue, label, warning, onClear, ...baseProps } = props

  const [value, setValue] = useState(() => {
    if (typeof propValue === 'string') return propValue
    if (typeof defaultValue === 'string') return defaultValue
    return ''
  })

  const handleValueChange = (value: string) => {
    if (Personnummer.valid(value)) {
      value = Personnummer.parse(value).format(true)
    }
    setValue(value)
  }

  return (
    <>
      <input {...baseProps} type="text" value={value} readOnly hidden />

      {!props.hidden && (
        <TextField
          {...baseProps}
          value={propValue}
          defaultValue={propValue ?? defaultValue}
          label={label}
          type="text"
          name={undefined}
          inputMode="numeric"
          minLength={10}
          maxLength={13}
          // https://github.com/personnummer/js
          pattern="^(\d{2}){0,1}(\d{2})(\d{2})(\d{2})([+-]?)((?!000)\d{3})(\d)$"
          onValueChange={handleValueChange}
          onClear={onClear}
          warning={warning}
        />
      )}
    </>
  )
}
