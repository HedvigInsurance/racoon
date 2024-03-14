'use client'

import styled from '@emotion/styled'
import { type ChangeEventHandler, type MouseEvent, type MouseEventHandler, useState } from 'react'
import { MinusIcon, PlusIcon, theme } from 'ui'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { useHighlightAnimation } from '@/utils/useHighlightAnimation'

type Props = {
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
}

/**
 * Specialized Stepper Input
 * Based on: https://www.magentaa11y.com/checklist-web/stepper-input/
 */
export const StepperInput = (props: Props) => {
  const { max, min = 0, value, defaultValue, label, optionLabel, ...inputProps } = props
  const [internalValue, setInternalValue] = useState(value ?? defaultValue ?? min)
  const { highlight, animationProps } = useHighlightAnimation<HTMLDivElement>()

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
    <>
      <Wrapper {...animationProps}>
        <StyledSelect
          {...inputProps}
          value={internalValue}
          onChange={handleChange}
          aria-label={label}
        >
          {options.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </StyledSelect>

        <SpaceFlex space={0.5}>
          <StyledButton
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
          </StyledButton>
          <StyledButton
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
          </StyledButton>
        </SpaceFlex>
      </Wrapper>
    </>
  )
}

const Wrapper = styled.div({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  height: '3rem',

  paddingInline: theme.space.md,
  borderRadius: theme.radius.sm,
  backgroundColor: theme.colors.translucent1,
})

const StyledSelect = styled.select({
  fontSize: theme.fontSizes.xl,
  color: theme.colors.textPrimary,
})

const StyledButton = styled.button({
  cursor: 'pointer',
  height: '1.5rem',
  width: '1.5rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})
