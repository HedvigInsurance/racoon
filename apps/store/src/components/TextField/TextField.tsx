import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { motion } from 'framer-motion'
import { ChangeEventHandler, InputHTMLAttributes, useState } from 'react'
import { LockIcon, Space, Text, theme } from 'ui'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { useHighlightAnimation } from '@/utils/useHighlightAnimation'

type BaseInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag'
>

type Props = BaseInputProps & {
  label: string
  variant?: 'small' | 'large'
  suffix?: string
  warning?: boolean
  message?: string
}

export const TextField = (props: Props) => {
  const { label, variant = 'large', suffix, warning = false, message, ...inputProps } = props
  const [value, setValue] = useState(props.defaultValue || '')
  const { highlight, animationProps } = useHighlightAnimation()

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setValue(event.target.value)
    inputProps.onChange?.(event)
  }

  const inputValue = inputProps.value || value

  const [Wrapper, InputWrapper, Input] =
    variant === 'large'
      ? ([LargeWrapper, LargeInputWrapper, LargeInput] as const)
      : ([SmallWrapper, SmallInputWrapper, SmallInput] as const)

  return (
    <Space y={0.25}>
      <Wrapper {...animationProps} data-active={!!inputValue} data-warning={warning}>
        <Label htmlFor={inputProps.id} data-disabled={inputProps.disabled} data-variant={variant}>
          {label}
        </Label>
        <InputWrapper>
          <Input {...inputProps} onKeyDown={highlight} onChange={handleChange} />
          <SpaceFlex align="center" space={0.5}>
            {suffix && inputValue && (
              <Text as="span" size={variant === 'large' ? 'xl' : 'lg'} color="textSecondary">
                {suffix}
              </Text>
            )}
            {inputProps.disabled && inputValue && (
              <LockIcon size="1rem" color={theme.colors.textSecondary} />
            )}
          </SpaceFlex>
        </InputWrapper>
      </Wrapper>
      {message && <MessageText size="sm">{message}</MessageText>}
    </Space>
  )
}

const warningAnimation = keyframes({
  '0%': {
    backgroundColor: theme.colors.amber100,
    color: theme.colors.amberText,
  },
  '100%': {
    backgroundColor: theme.colors.gray100,
    color: theme.colors.textPrimary,
  },
})

const warningColorAnimation = keyframes({
  '0%': {
    color: theme.colors.amberText,
  },
  '100%': {
    color: theme.colors.textPrimary,
  },
})

const LargeWrapper = styled(motion.div)({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  borderRadius: theme.radius.sm,
  backgroundColor: theme.colors.gray100,
  height: '4.5rem',
  width: '100%',

  '&[data-warning=true]': {
    animation: `${warningAnimation} 1.5s cubic-bezier(0.2, -2, 0.8, 2) 2`,
  },
})

const SmallWrapper = styled(LargeWrapper)({ height: '3.25rem' })

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
  transform: 'translate(0, 0) scale(1)',
  paddingInline: theme.space.md,

  fontSize: theme.fontSizes.xl,
  '&[data-variant=small]': { fontSize: theme.fontSizes.lg },

  [`${LargeWrapper}:focus-within > &, ${LargeWrapper}[data-active=true] > &`]: {
    overflow: 'visible',
    transform: `translate(calc(${theme.space.md} * 0.4), -0.6rem) scale(0.6)`,
  },

  [`${SmallWrapper}:focus-within > &, ${SmallWrapper}[data-active=true] > &`]: {
    transform: `translate(calc(${theme.space.md} * 0.2), -0.6rem) scale(0.8)`,
  },

  [`${LargeWrapper}[data-highlight=true] > &`]: {
    color: theme.colors.greenText,
  },

  [`${LargeWrapper}[data-warning=true] > &`]: {
    animation: `${warningColorAnimation} 1.5s cubic-bezier(0.2, -2, 0.8, 2) 2`,
  },

  '&&[data-disabled=true]': {
    color: theme.colors.textTertiary,
  },
})

const LargeInputWrapper = styled.div({
  position: 'absolute',
  bottom: '0.625rem',
  width: '100%',

  display: 'flex',
  alignItems: 'center',
  paddingRight: theme.space.md,
})

const SmallInputWrapper = styled(LargeInputWrapper)({ bottom: '0.3125rem' })

const LargeInput = styled.input({
  width: '100%',
  fontSize: theme.fontSizes.xl,
  paddingInline: theme.space.md,

  ':disabled': {
    color: theme.colors.textSecondary,
    cursor: 'not-allowed',

    // Webkit overrides
    WebkitTextFillColor: theme.colors.textSecondary,
    opacity: 1,
  },
})

const SmallInput = styled(LargeInput)({ fontSize: theme.fontSizes.lg })

const MessageText = styled(Text)({ paddingLeft: theme.space.md })
