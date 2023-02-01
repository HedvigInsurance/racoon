import styled from '@emotion/styled'
import { motion } from 'framer-motion'
import { useTranslation } from 'next-i18next'
import { ChangeEventHandler, MouseEventHandler, useState } from 'react'
import { theme } from 'ui'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { HouseholdSizeField as HouseholdSizeFieldType } from '@/services/PriceCalculator/Field.types'
import { useHighlightAnimation } from '@/utils/useHighlightAnimation'

type FieldProps = {
  field: HouseholdSizeFieldType
  autoFocus?: boolean
}

/**
 * Specialized Stepper Input
 * Based on: https://www.magentaa11y.com/checklist-web/stepper-input/
 */
export const HouseholdSizeField = ({ field, autoFocus = false }: FieldProps) => {
  const { t } = useTranslation('purchase-form')
  const minValue = 0
  const maxValue = field.max
  const [value, setValue] = useState(field.value || field.defaultValue || minValue)
  const { highlight, animationProps } = useHighlightAnimation()

  const increment: MouseEventHandler = (event) => {
    event.preventDefault()
    highlight()
    setValue((value) => Math.min(maxValue, value + 1))
  }

  const decrement: MouseEventHandler = (event) => {
    event.preventDefault()
    highlight()
    setValue((value) => Math.max(value - 1, minValue))
  }

  const handleChange: ChangeEventHandler<HTMLSelectElement> = (event) => {
    const numberValue = parseInt(event.target.value, 10)
    setValue(numberValue)
  }

  const options = Array.from({ length: maxValue + 1 }, (_, count) => ({
    label: t('HOUSEHOLD_SIZE_VALUE', { count }),
    value: count,
  }))

  return (
    <>
      <Wrapper {...animationProps}>
        <StyledSelect
          name={field.name}
          required={field.required}
          value={value}
          onChange={handleChange}
          autoFocus={autoFocus}
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
            disabled={value === minValue}
          >
            <Minus />
          </StyledButton>
          <StyledButton
            type="button"
            onClick={increment}
            tabIndex={-1}
            aria-hidden={true}
            disabled={value === maxValue}
          >
            <Plus />
          </StyledButton>
        </SpaceFlex>
      </Wrapper>
    </>
  )
}

const Wrapper = styled(motion.div)({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',

  padding: `${theme.space.sm} ${theme.space.md}`,
  borderRadius: theme.radius.sm,
  backgroundColor: theme.colors.gray100,
})

const StyledSelect = styled.select({
  fontSize: theme.fontSizes.xl,
  color: theme.colors.textPrimary,
})

const Minus = styled.div({
  width: '1.25rem',
  height: '0.0625rem', // 1px
  backgroundColor: theme.colors.textPrimary,
})

const Plus = () => {
  return (
    <PlusWrapper>
      <Minus />
      <PlusVerticalLine />
    </PlusWrapper>
  )
}

const PlusVerticalLine = styled.div({
  height: '1.25rem',
  width: '0.0625rem', // 1px
  backgroundColor: theme.colors.textPrimary,
  position: 'absolute',
})

const PlusWrapper = styled.div({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

const StyledButton = styled.button({
  cursor: 'pointer',
  height: '1.5rem',
  width: '1.5rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  '&[disabled] div': {
    backgroundColor: theme.colors.textDisabled,
  },
})
