'use client'

import clsx from 'clsx'
import type { ChangeEventHandler, InputHTMLAttributes, MouseEventHandler, ReactNode } from 'react'
import { useId, useRef, useState } from 'react'
import { CrossIcon } from 'ui/src/icons/CrossIcon'
import { LockIcon } from 'ui/src/icons/LockIcon'
import { WarningTriangleIcon } from 'ui/src/icons/WarningTriangleIcon'
import { sprinkles } from 'ui/src/theme/sprinkles.css'
import { Text, theme, yStack, useHighlightAnimation } from 'ui'
import {
  deleteButton,
  input,
  inputLabel,
  inputWrapper,
  upperCaseInputStyle,
  wrapper,
} from './TextField.css'

type BaseInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag' | 'onChange' | 'size'
>

export type Props = BaseInputProps & {
  label: string
  size?: 'small' | 'medium' | 'large'
  suffix?: string
  warning?: boolean
  message?: string
  onValueChange?: (value: string) => void
  onClear?: () => void
  upperCaseInput?: boolean
}

export const TextField = (props: Props) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const {
    defaultValue,
    label,
    size = 'large',
    suffix,
    warning = false,
    message,
    id,
    onValueChange,
    onClear,
    upperCaseInput,
    className,
    ...inputProps
  } = props
  const [value, setValue] = useState(defaultValue || '')
  const { highlight, animationProps } = useHighlightAnimation<HTMLDivElement>()
  const generatedId = useId()
  const identifier = id || generatedId

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const newValue = event.target.value
    setValue(newValue)
    onValueChange?.(newValue)
  }

  const handleClickDelete: MouseEventHandler<HTMLButtonElement> = () => {
    onClear?.()
    const newValue = ''
    setValue(newValue)
    onValueChange?.(newValue)
  }

  const handleClickWrapper: MouseEventHandler<HTMLDivElement> = () => {
    inputRef.current?.focus()
  }

  const inputValue = inputProps.value || value

  let endIcon: ReactNode = null
  if (warning) {
    endIcon = <WarningTriangleIcon size="1.5em" color={theme.colors.amber600} />
  } else if (inputValue) {
    if (inputProps.disabled || inputProps.readOnly) {
      endIcon = <LockIcon size="1.5rem" color={theme.colors.textSecondary} />
    } else {
      endIcon = (
        <button
          className={deleteButton}
          type="button"
          onClick={handleClickDelete}
          aria-hidden={true}
          tabIndex={-1}
        >
          <CrossIcon size="1.5rem" />
        </button>
      )
    }
  }

  return (
    <div className={clsx(yStack({ gap: 'xxs' }), className)}>
      <div
        className={wrapper[size]}
        {...animationProps}
        data-active={!!inputValue}
        data-warning={warning}
        data-readonly={inputProps.readOnly ? '' : undefined}
        data-hidden={inputProps.hidden ?? undefined}
        onClick={handleClickWrapper}
      >
        <label
          className={inputLabel[size]}
          htmlFor={identifier}
          data-disabled={inputProps.disabled}
        >
          {label}
        </label>
        <div className={inputWrapper}>
          <input
            className={clsx(input[size], upperCaseInput && upperCaseInputStyle)}
            {...inputProps}
            id={identifier}
            ref={inputRef}
            onKeyDown={highlight}
            onChange={handleChange}
            value={inputValue}
            aria-label={label}
          />
          {suffix && inputValue && (
            <Text as="span" size={size === 'large' ? 'xl' : 'lg'} color="textSecondary">
              {suffix}
            </Text>
          )}

          {endIcon}
        </div>
      </div>
      {message && (
        <Text className={sprinkles({ paddingLeft: 'md' })} size="xs">
          {message}
        </Text>
      )}
    </div>
  )
}
