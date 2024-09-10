'use client'

import Personnummer from 'personnummer'
import type { InputHTMLAttributes } from 'react'
import { memo } from 'react'
import { useState } from 'react'
import type { Props as TextFieldProps } from '@/components/TextField/TextField'
import { TextField } from '@/components/TextField/TextField'

export type Props = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag' | 'size'
> & {
  label: string
  warning?: boolean
  message?: string
  onValidValueEntered?: (value: string) => void
} & Pick<TextFieldProps, 'onClear' | 'size'>

/**
 * Personal Number input field.
 * Only supports Swedish personal numbers.
 */
export const PersonalNumberField = memo((props: Props) => {
  const {
    value: propValue,
    defaultValue,
    label,
    warning,
    size,
    onClear,
    onValidValueEntered,
    ...forwardedProps
  } = props

  const [value, setValue] = useState(() => {
    if (typeof propValue === 'string') return propValue
    if (typeof defaultValue === 'string') return defaultValue
    return ''
  })

  const handleValueChange = (value: string) => {
    if (Personnummer.valid(value)) {
      value = Personnummer.parse(value).format(true)
      setValue(value)
      onValidValueEntered?.(value)
    } else {
      setValue(value)
    }
  }

  return (
    <>
      <input {...forwardedProps} type="text" value={value} readOnly hidden />

      {!props.hidden && (
        <TextField
          {...forwardedProps}
          value={propValue}
          defaultValue={propValue ?? defaultValue}
          label={label}
          type="text"
          size={size}
          name={undefined}
          inputMode="numeric"
          minLength={10}
          maxLength={13}
          // https://github.com/personnummer/js
          pattern="^(\d{2}){0,1}(\d{2})(\d{2})(\d{2})([+\-]?)((?!000)\d{3})(\d)$"
          onValueChange={handleValueChange}
          onClear={onClear}
          warning={warning}
        />
      )}
    </>
  )
})
PersonalNumberField.displayName = 'PersonalNumberField'
