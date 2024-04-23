'use client'

import clsx from 'clsx'
import {
  type ChangeEventHandler,
  type MouseEvent,
  type MouseEventHandler,
  useState,
  useId,
} from 'react'
import { MinusIcon, PlusIcon, theme } from 'ui'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { useHighlightAnimation } from '@/utils/useHighlightAnimation'
import { outerWrapper, innerWrapper, select, inputLabel, stepButton } from './StepperInput.css'

export type StepperInputProps = {
  name?: string
  autoFocus?: boolean
  min?: number
  max: number
  value?: number
  defaultValue?: number
  required?: boolean
  label?: string
  optionLabel: (count: number) => string
  onChange?: (value: number) => void
  className?: string
}

/**
 * Specialized Stepper Input
 * Based on: https://www.magentaa11y.com/checklist-web/stepper-input/
 */
export const StepperInput = (props: StepperInputProps) => {
  const { max, min = 0, value, defaultValue, label, optionLabel, className, ...inputProps } = props
  const [internalValue, setInternalValue] = useState(value ?? defaultValue ?? min)
  const { highlight, animationProps } = useHighlightAnimation<HTMLDivElement>()

  const selectId = useId()
  const labelId = useId()

  const changeValue = (event: MouseEvent, amount: 1 | -1) => {
    event.preventDefault()
    highlight()
    setInternalValue((value) => {
      const nextValue = Math.min(max, Math.max(min, value + amount))
      props.onChange?.(nextValue)
      return nextValue
    })
  }

  const increment: MouseEventHandler = (event) => {
    changeValue(event, 1)
  }

  const decrement: MouseEventHandler = (event) => {
    changeValue(event, -1)
  }

  const handleChange: ChangeEventHandler<HTMLSelectElement> = (event) => {
    const numberValue = parseInt(event.target.value, 10)
    setInternalValue(numberValue)
    props.onChange?.(numberValue)
  }

  const options = Array.from({ length: max + 1 }, (_, count) => ({
    label: optionLabel(count),
    value: count,
  }))

  const isDecrementDisabled = internalValue === min
  const isIncrementDisabled = internalValue === max

  return (
    <div className={clsx(outerWrapper, className)} {...animationProps}>
      <div className={innerWrapper}>
        {label && (
          <label id={labelId} className={inputLabel} htmlFor={selectId}>
            {label}
          </label>
        )}

        <select
          {...inputProps}
          id={selectId}
          className={select}
          value={internalValue}
          onChange={handleChange}
          aria-labelledby={labelId}
        >
          {options.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      <SpaceFlex space={0.5}>
        <button
          className={stepButton}
          type="button"
          onClick={decrement}
          tabIndex={-1}
          aria-hidden={true}
          disabled={isDecrementDisabled}
        >
          <MinusIcon
            size="1rem"
            color={isDecrementDisabled ? theme.colors.textDisabled : theme.colors.textPrimary}
          />
        </button>
        <button
          className={stepButton}
          type="button"
          onClick={increment}
          tabIndex={-1}
          aria-hidden={true}
          disabled={isIncrementDisabled}
        >
          <PlusIcon
            size="1rem"
            color={isIncrementDisabled ? theme.colors.textDisabled : theme.colors.textPrimary}
          />
        </button>
      </SpaceFlex>
    </div>
  )
}
