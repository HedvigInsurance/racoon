'use client'

import { ComponentProps, useState } from 'react'
import { label, checkbox, checkboxStack, checkmark } from './CheckboxInput.css'
import { TickIcon } from '@hedvig-ui/icons'
import { theme } from '@hedvig-ui/redesign/theme'

type CheckboxInputProps = {
  label: string
} & Omit<ComponentProps<'input'>, 'type'>

export const CheckboxInput = (props: CheckboxInputProps) => {
  const [isChecked, setIsChecked] = useState(props.defaultChecked)
  const decoratedProps: CheckboxInputProps = {
    ...props,
    // Let users inject their own onChange but also insert our own
    onChange: (e) => {
      setIsChecked(e.target.checked)
      props.onChange?.(e)
    },
  }

  return (
    <label className={label}>
      <div className={checkboxStack}>
        <input className={checkbox} type={'checkbox'} {...decoratedProps} />
        {isChecked ? (
          <TickIcon
            className={checkmark}
            fillColor={theme.colors.textNegative}
          />
        ) : null}
        {props.disabled && (
          <input
            type="hidden"
            name={decoratedProps.name}
            value={decoratedProps.defaultChecked ? 'checked' : ''}
          />
        )}
      </div>
      {props.label}
    </label>
  )
}
