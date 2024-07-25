'use client'

import { clsx } from 'clsx'
import { type ChangeEventHandler, useId } from 'react'
import { ChevronIcon, InputBase, type InputBaseProps, type UIColorKeys, getColor } from 'ui'
import { useHighlightAnimation } from '@/utils/useHighlightAnimation'
import {
  chevronIcon,
  inputLabel,
  wrapperWithLabelVariants,
  select,
  wrapperVariants,
} from './InputSelect.css'

export type InputSelectProps = InputBaseProps & {
  name: string
  options: ReadonlyArray<{ name: string; value: string; disabled?: boolean }>
  value?: string
  defaultValue?: string
  onChange?: React.ChangeEventHandler<HTMLSelectElement>
  required?: boolean
  disabled?: boolean
  placeholder?: string
  autoFocus?: boolean
  className?: string
  size?: 'small' | 'medium' | 'large'
  backgroundColor?: Extract<UIColorKeys, 'backgroundStandard' | 'backgroundFrostedGlass'>
}

export const InputSelect = ({
  options,
  name,
  onChange,
  value,
  defaultValue,
  placeholder,
  label,
  size = 'medium',
  className,
  backgroundColor: _backgroundColor,
  ...rest
}: InputSelectProps) => {
  const backgroundColor = _backgroundColor ? getColor(_backgroundColor) : undefined

  const { highlight, animationProps } = useHighlightAnimation<HTMLSelectElement>()

  const handleChange: ChangeEventHandler<HTMLSelectElement> = (event) => {
    onChange?.(event)
    highlight()
  }

  const labelId = useId()
  const selectId = useId()

  return (
    <InputBase {...rest}>
      {() => (
        <div
          className={clsx(
            wrapperVariants.base,
            wrapperVariants[size],
            label && wrapperWithLabelVariants[size],
            className,
          )}
        >
          {label && (
            <label id={labelId} htmlFor={selectId} className={inputLabel}>
              {label}
            </label>
          )}
          <select
            id={selectId}
            name={name}
            onChange={handleChange}
            value={value}
            defaultValue={value ? undefined : (defaultValue ?? '')}
            style={{ backgroundColor }}
            className={clsx(select)}
            {...animationProps}
            {...rest}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map(({ name, value, disabled }) => (
              <option key={value} value={value} disabled={disabled}>
                {name}
              </option>
            ))}
          </select>

          <ChevronIcon size="1rem" className={chevronIcon} />
        </div>
      )}
    </InputBase>
  )
}
