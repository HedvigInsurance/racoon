'use client'

import { ChangeEvent, KeyboardEvent, useRef } from 'react'
import * as React from 'react'
import toast from 'react-hot-toast'
import * as math from 'mathjs'
import { isPressing, Keys } from '@hedvig-ui'
import { Input, InputProps } from './input'

interface CalculatorProps extends Omit<InputProps, 'type' | 'onChange'> {
  onChange?: (value: string) => void
}

const isExpressionValid = (value: string) => /^[0-9 +-/*]+$/.test(value)

export const CalculatingInput = React.forwardRef<
  HTMLInputElement,
  CalculatorProps
>(({ onChange, onBlur, value, ...props }, forwardRef) => {
  const internalRef = useRef<HTMLInputElement>(null)

  const ref = forwardRef ?? internalRef

  const evaluate = (currentValue: string) => {
    if (!currentValue) {
      return
    }

    let result = 0

    try {
      result = math.evaluate(currentValue)
    } catch (err) {
      console.error(err)
      toast.error('Not valid expression')
      return
    }

    onChange?.(`${result}`)
  }

  const onKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    const {
      currentTarget: { value: currentValue },
    } = event

    if (
      (!isPressing(event, Keys.Enter) && !isPressing(event, Keys.Equal)) ||
      !currentValue
    ) {
      return
    }

    evaluate(currentValue)
  }

  const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const {
      currentTarget: { value: currentValue },
    } = event
    if (!currentValue) {
      onChange?.('0')
      return
    }
    if (!isExpressionValid(currentValue)) {
      return
    }

    onChange?.(currentValue)
  }

  return (
    <Input
      ref={ref}
      onKeyDown={onKeyDownHandler}
      value={value}
      onChange={onChangeHandler}
      type="text"
      autoComplete="off"
      onBlur={(e) => {
        const {
          currentTarget: { value: currentValue },
        } = e

        evaluate(currentValue)
        onBlur?.(e)
      }}
      {...props}
    />
  )
})
