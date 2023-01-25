import styled from '@emotion/styled'
import { motion } from 'framer-motion'
import { ChangeEventHandler, InputHTMLAttributes, useState } from 'react'
import { Space, Text, theme } from 'ui'
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

  const [Wrapper, Input, Suffix] =
    variant === 'large'
      ? ([LargeWrapper, LargeInput, LargeSuffix] as const)
      : ([SmallWrapper, SmallInput, SmallSuffix] as const)

  return (
    <Space y={0.25}>
      <Wrapper {...animationProps} data-active={!!inputValue} data-warning={warning}>
        <Label htmlFor={inputProps.id} data-disabled={inputProps.disabled} data-variant={variant}>
          {label}
        </Label>
        <SpaceFlex align="center" space={0}>
          <Input {...inputProps} onKeyDown={highlight} onChange={handleChange} />
          {suffix && inputValue && <Suffix>{suffix}</Suffix>}
        </SpaceFlex>
      </Wrapper>
      {message && <MessageText size="sm">{message}</MessageText>}
    </Space>
  )
}

const LargeWrapper = styled(motion.div)({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  borderRadius: theme.radius.sm,
  backgroundColor: theme.colors.gray100,
  height: '4rem',
  width: '100%',

  ':focus-within, &[data-active=true]': {
    '> label': {
      transform: `translate(calc(${theme.space.md} * 0.4), -0.5rem) scale(0.6)`,
      overflow: 'visible',
    },
  },

  '&[data-warning=true]': {
    // TODO: use theme color: amber fill 1
    backgroundColor: '#FBEDC5',
    // TODO: use theme color: amber fill 3
    border: '1px solid #F5E0A3',
  },
})

const Label = styled.label(({ theme }) => ({
  position: 'absolute',
  left: 0,
  right: 0,
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',

  pointerEvents: 'none',
  transformOrigin: 'top left',
  transition: 'transform 200ms cubic-bezier(0, 0, 0.2, 1) 0ms',
  transform: `translate(0, 0) scale(1)`,
  paddingInline: theme.space.md,

  fontSize: theme.fontSizes.xl,
  '&[data-variant=small]': {
    fontSize: theme.fontSizes.lg,
  },

  '&[data-disabled=true]': {
    color: theme.colors.textDisabled,
  },

  '[data-warning=true] &': {
    // TODO: use theme color: amber text
    color: '#8A4C0F',
  },
}))

const LargeInput = styled.input({
  width: '100%',
  fontSize: theme.fontSizes.xl,
  paddingInline: theme.space.md,
  paddingTop: theme.space.md,

  ':disabled': {
    color: theme.colors.textDisabled,
    cursor: 'not-allowed',

    // Webkit overrides
    WebkitTextFillColor: theme.colors.textDisabled,
    opacity: 1,
  },

  '[data-warning=true] &': {
    // TODO: use theme color: amber text
    color: '#8A4C0F',
  },
})

type BaseProps = { children: React.ReactNode }

const StyledLargeSuffix = styled(Text)({
  paddingRight: theme.space.md,

  '[data-warning=true] &': {
    // TODO: use theme color: amber text
    color: '#8A4C0F',
  },
})

const LargeSuffix = (props: BaseProps) => (
  <StyledLargeSuffix as="span" size="xl" color="textSecondary" {...props} />
)

const SmallWrapper = styled(LargeWrapper)({
  height: '3.25rem',

  ':focus-within, &[data-active=true]': {
    '> label': {
      transform: `translate(calc(${theme.space.md} * 0.2), -0.6rem) scale(0.8)`,
    },
  },
})

const SmallInput = styled(LargeInput)({ fontSize: theme.fontSizes.lg })

const StyledSmallSuffix = styled(StyledLargeSuffix)()
const SmallSuffix = (props: BaseProps) => (
  <StyledSmallSuffix as="span" size="lg" color="textSecondary" {...props} />
)

const MessageText = styled(Text)({
  paddingLeft: theme.space.md,
  '[data-warning=true] ~ &': {
    // TODO: use theme color: amber text
    color: '#8A4C0F',
  },
})
