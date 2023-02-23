import styled from '@emotion/styled'
import { motion } from 'framer-motion'
import { ChangeEventHandler, InputHTMLAttributes, useId, useState } from 'react'
import { ChevronIcon, Space, theme } from 'ui'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { useHighlightAnimation } from '@/utils/useHighlightAnimation'

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'children'>
type Props = InputProps & {
  label: string
  value?: string
  defaultValue?: string
}

export const DateInput = (props: Props) => {
  const { label, onChange, value, defaultValue, ...inputProps } = props
  const [internalValue, setInternalValue] = useState(defaultValue)
  const inputValue = value || internalValue

  const identifier = useId()
  const { highlight, animationProps } = useHighlightAnimation()

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    highlight()
    setInternalValue(event.target.value)
    onChange?.(event)
  }

  return (
    <Space y={0.25}>
      <Wrapper {...animationProps} data-active={!!inputValue}>
        <Label htmlFor={inputProps.id} data-disabled={inputProps.disabled}>
          {label}
        </Label>
        <SpaceFlex align="center" space={0}>
          <StyledInput
            type="date"
            id={identifier}
            value={inputValue}
            onChange={handleChange}
            {...inputProps}
          />
        </SpaceFlex>
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
  height: '3.25rem',
  width: '100%',
  cursor: 'pointer',
})

const Label = styled.label({
  position: 'absolute',
  left: 0,
  right: 0,
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  color: theme.colors.textSecondary,

  pointerEvents: 'none',
  transformOrigin: 'top left',
  transition: 'transform 200ms cubic-bezier(0, 0, 0.2, 1) 0ms',
  transform: `translate(0, 0) scale(1)`,
  paddingInline: theme.space.md,

  fontSize: theme.fontSizes.lg,

  ':focus-within > &, [data-active=true] > &': {
    overflow: 'visible',
    color: theme.colors.textPrimary,
    transform: `translate(calc(${theme.space.md} * 0.2), -0.6rem) scale(0.8)`,
  },

  '&&[data-disabled=true]': {
    color: theme.colors.textSecondary,
  },
})

const StyledInput = styled.input({
  width: '100%',
  fontSize: theme.fontSizes.lg,
  paddingInline: theme.space.md,
  paddingTop: theme.space.md,

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
})

const StyledChevronIcon = styled(ChevronIcon)(() => ({
  position: 'absolute',
  top: '50%',
  right: '1.125rem',
  pointerEvents: 'none',
  transform: 'translateY(-50%)',

  [`${Wrapper}:focus-within &`]: {
    transform: 'translateY(-50%) rotate(180deg)',
  },
}))
