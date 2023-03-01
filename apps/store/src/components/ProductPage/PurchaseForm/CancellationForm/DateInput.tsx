import styled from '@emotion/styled'
import { motion } from 'framer-motion'
import { useTranslation } from 'next-i18next'
import { ChangeEventHandler, InputHTMLAttributes, useId, useState } from 'react'
import { ChevronIcon, Space, theme, Text } from 'ui'
import { convertToDate } from '@/utils/date'
import { useFormatter } from '@/utils/useFormatter'
import { useHighlightAnimation } from '@/utils/useHighlightAnimation'

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'children'>
type Props = InputProps & {
  label: string
  value?: string
  defaultValue?: string
}

export const DateInput = (props: Props) => {
  const { t } = useTranslation()
  const { label, onChange, value, defaultValue, ...inputProps } = props
  const [internalValue, setInternalValue] = useState(defaultValue)
  const inputValue = value || internalValue
  const dateValue = convertToDate(inputValue)
  const formatter = useFormatter()

  const identifier = useId()
  const { highlight, animationProps } = useHighlightAnimation()

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    highlight()
    setInternalValue(event.target.value)
    onChange?.(event)
  }

  const displayValue = dateValue ? (
    <InputText size="xl">{formatter.fromNow(dateValue)}</InputText>
  ) : (
    <InputText size="xl" color="textTertiary">
      {t('DATE_INPUT_EMPTY_LABEL')}
    </InputText>
  )

  return (
    <Space y={0.25}>
      <Wrapper {...animationProps} data-active={!!inputValue}>
        <Label htmlFor={inputProps.id} data-disabled={inputProps.disabled}>
          {label}
        </Label>
        {displayValue}
        <StyledInput
          type="date"
          id={identifier}
          value={inputValue}
          onChange={handleChange}
          {...inputProps}
        />

        <StyledChevronIcon size="1rem" />
      </Wrapper>
    </Space>
  )
}

const Wrapper = styled(motion.div)({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  borderRadius: theme.radius.sm,
  backgroundColor: theme.colors.gray100,
  height: '4.5rem',
  width: '100%',
  cursor: 'pointer',
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
    display: 'none!important',
  },
})

const InputText = styled(Text)({
  position: 'absolute',
  left: theme.space.md,
  top: theme.space.xl,
})

const StyledChevronIcon = styled(ChevronIcon)(() => ({
  position: 'absolute',
  top: '50%',
  right: '1.125rem',
  pointerEvents: 'none',
  transform: 'translateY(-50%)',
  transition: 'transform 200ms cubic-bezier(0.77,0,0.18,1)',

  [`${Wrapper}:focus-within &`]: {
    transform: 'translateY(-50%) rotate(180deg)',
  },
}))
