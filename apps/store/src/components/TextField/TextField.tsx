'use client'

import type { ChangeEventHandler, InputHTMLAttributes, MouseEventHandler } from 'react'
import { useId, useRef, useState } from 'react'
import { sprinkles } from 'ui/src/theme/sprinkles.css'
import { CrossIconSmall, LockIcon, Text, WarningTriangleIcon, theme, yStack } from 'ui'
import { useHighlightAnimation } from '@/utils/useHighlightAnimation'
import {
  deleteButton,
  input,
  inputLabel,
  inputWrapper,
  messageWithIcon,
  wrapper,
} from './TextField.css'

type BaseInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag' | 'onChange' | 'size'
>

export type Props = BaseInputProps & {
  label: string
  size?: 'small' | 'large'
  suffix?: string
  warning?: boolean
  message?: string
  onValueChange?: (value: string) => void
  onClear?: () => void
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

  return (
    <div className={yStack({ gap: 'xxs' })}>
      <div
        className={wrapper[size]}
        {...animationProps}
        data-active={!!inputValue || !!inputProps.placeholder}
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
        <div className={inputWrapper[size]}>
          <input
            className={input[size]}
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

          {inputValue &&
            (inputProps.disabled || inputProps.readOnly ? (
              <LockIcon size="1rem" color={theme.colors.textSecondary} />
            ) : (
              <button
                className={deleteButton}
                type="button"
                onClick={handleClickDelete}
                aria-hidden={true}
                tabIndex={-1}
              >
                <CrossIconSmall />
              </button>
            ))}
        </div>
      </div>
      {message &&
        (warning ? (
          <Text className={messageWithIcon} size="sm">
            <WarningTriangleIcon size="1em" color={theme.colors.amber600} />
            {message}
          </Text>
        ) : (
          <Text className={sprinkles({ paddingLeft: 'md' })} size="sm">
            {message}
          </Text>
        ))}
    </div>
  )
}
