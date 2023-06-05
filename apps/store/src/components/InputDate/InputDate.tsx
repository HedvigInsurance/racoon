import styled from '@emotion/styled'
import { motion } from 'framer-motion'
import { useTranslation } from 'next-i18next'
import { ChangeEventHandler, InputHTMLAttributes, useId, useState } from 'react'
import { ChevronIcon, theme, Text } from 'ui'
import { convertToDate } from '@/utils/date'
import { useFormatter } from '@/utils/useFormatter'
import { useHighlightAnimation } from '@/utils/useHighlightAnimation'

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'children'>
type Props = InputProps & {
  label: string
  value?: string
  defaultValue?: string
}

export const InputDate = (props: Props) => {
  const { t } = useTranslation()
  const { label, onChange, value, defaultValue, ...inputProps } = props
  const [internalValue, setInternalValue] = useState(defaultValue)
  const inputValue = value || internalValue
  const dateValue = convertToDate(inputValue)
  const formatter = useFormatter()

  const identifier = useId()
  const { highlight, animationProps } = useHighlightAnimation()

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setInternalValue(event.target.value)

    // NOTE: Mobile Safari does not support min/max values for Date input, let's validate ourselves
    const { valueAsDate } = event.target
    if (valueAsDate != null) {
      const minValue = convertToDate(props.min)
      const maxValue = convertToDate(props.max)
      if (minValue && valueAsDate < minValue) {
        event.target.setCustomValidity(
          t('DATE_TOO_EARLY', { ns: 'common', minValue: formatter.fromNow(minValue) }),
        )
      } else if (maxValue && valueAsDate > maxValue) {
        event.target.setCustomValidity(
          t('DATE_TOO_LATE', { ns: 'common', maxValue: formatter.fromNow(maxValue) }),
        )
      } else {
        event.target.setCustomValidity('')
        highlight()
        onChange?.(event)
      }
      event.target.reportValidity()
    }
  }

  const displayValue = dateValue ? (
    <Text size="xl">{formatter.fromNow(dateValue)}</Text>
  ) : (
    <Text size="xl" color="textTertiary">
      {t('DATE_INPUT_EMPTY_LABEL')}
    </Text>
  )

  return (
    <Wrapper {...animationProps} data-active={!!inputValue}>
      <Label htmlFor={inputProps.id} data-disabled={inputProps.disabled}>
        {label}
      </Label>
      <InnerWrapper>
        {displayValue} <StyledChevronIcon size="1rem" />
      </InnerWrapper>
      <StyledInput
        type="date"
        id={identifier}
        value={inputValue}
        onChange={handleChange}
        {...inputProps}
      />
    </Wrapper>
  )
}

const Wrapper = styled(motion.div)({
  position: 'relative',
  borderRadius: theme.radius.sm,
  backgroundColor: theme.colors.gray100,
  height: '4.5rem',
  width: '100%',
  cursor: 'pointer',
})

const InnerWrapper = styled.div({
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingTop: theme.space.xl,
  paddingRight: '1.25rem',
  paddingBottom: theme.space.sm,
  paddingLeft: theme.space.md,
})

const Label = styled.label({
  position: 'absolute',
  left: theme.space.md,
  top: theme.space.sm,
  fontSize: theme.fontSizes.xs,
  overflow: 'visible',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  color: theme.colors.textSecondary,

  '&&[data-disabled=true]': {
    color: theme.colors.textSecondary,
  },
})

const StyledInput = styled.input({
  position: 'absolute',
  inset: 0,
  ':disabled': {
    color: theme.colors.textSecondary,
    cursor: 'not-allowed',

    // Webkit overrides
    WebkitTextFillColor: theme.colors.textSecondary,
    opacity: 1,
  },

  '::-webkit-calendar-picker-indicator': {
    background: 'transparent',
    bottom: 0,
    color: 'transparent',
    cursor: 'pointer',
    height: 'auto',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    width: 'auto',
  },

  '::-webkit-datetime-edit-fields-wrapper': {
    display: 'none',
  },

  '::-webkit-date-and-time-value': {
    visibility: 'hidden',
  },
})

const StyledChevronIcon = styled(ChevronIcon)(() => ({
  pointerEvents: 'none',
  transition: 'transform 200ms cubic-bezier(0.77,0,0.18,1)',

  [`${Wrapper}:focus-within &`]: {
    transform: 'rotate(180deg)',
  },
}))
