import isPropValid from '@emotion/is-prop-valid'
import styled from '@emotion/styled'
import { isValidMotionProp, motion } from 'framer-motion'
import { ChangeEventHandler, InputHTMLAttributes, useState } from 'react'
import { Text } from 'ui'
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
}

export const TextField = ({ label, variant = 'large', suffix, ...props }: Props) => {
  const [value, setValue] = useState(props.defaultValue || '')
  const { highlight, animationProps } = useHighlightAnimation()

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setValue(event.target.value)
    props.onChange?.(event)
  }

  const inputValue = props.value || value

  const [Wrapper, Input, Suffix, labelSize] =
    variant === 'large'
      ? ([LargeWrapper, LargeInput, LargeSuffix, 'xl'] as const)
      : ([SmallWrapper, SmallInput, SmallSuffix, 'lg'] as const)

  return (
    <Wrapper {...animationProps} isActive={!!inputValue}>
      <Label htmlFor={props.id}>
        <Text as="span" size={labelSize} color={props.disabled ? 'textDisabled' : 'textPrimary'}>
          {label}
        </Text>
      </Label>
      <SpaceFlex align="center" space={0}>
        <Input {...props} onKeyDown={highlight} onChange={handleChange} />
        {suffix && inputValue && <Suffix>{suffix}</Suffix>}
      </SpaceFlex>
    </Wrapper>
  )
}

type WrapperProps = { isActive: boolean }

const LargeWrapper = styled(motion.div, {
  shouldForwardProp: (propName) => isPropValid(propName) || isValidMotionProp(propName),
})<WrapperProps>(({ theme, isActive }) => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  borderRadius: theme.radius.sm,
  backgroundColor: theme.colors.gray100,
  height: '4rem',

  [':focus-within > label']: {
    transform: `translate(calc(${theme.space.md} * 0.4), -0.5rem) scale(0.6)`,
  },

  ...(isActive && {
    '> label': {
      transform: `translate(calc(${theme.space.md} * 0.4), -0.5rem) scale(0.6)`,
    },
  }),

  ':has(input:focus-visible)': {
    boxShadow: `0 0 0 1px ${theme.colors.textPrimary}`,
  },
}))

const Label = styled.label(({ theme }) => ({
  position: 'absolute',
  pointerEvents: 'none',
  transformOrigin: 'top left',
  transition: 'transform 200ms cubic-bezier(0, 0, 0.2, 1) 0ms',
  transform: `translate(0, 0) scale(1)`,
  paddingInline: theme.space.md,
  whiteSpace: 'nowrap',
}))

const LargeInput = styled.input(({ theme }) => ({
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
}))

const LargeSuffix = styled(Text)(({ theme }) => ({ paddingRight: theme.space.md }))
LargeSuffix.defaultProps = { size: 'xl', color: 'textSecondary', as: 'span' }

const SmallWrapper = styled(LargeWrapper)(({ theme, isActive }) => ({
  width: '100%',
  height: '3.25rem',

  [':focus-within > label']: {
    transform: `translate(calc(${theme.space.md} * 0.2), -0.6rem) scale(0.8)`,
  },

  ...(isActive && {
    '> label': {
      transform: `translate(calc(${theme.space.md} * 0.2), -0.6rem) scale(0.8)`,
    },
  }),
}))

const SmallInput = styled(LargeInput)(({ theme }) => ({ fontSize: theme.fontSizes.lg }))

const SmallSuffix = styled(LargeSuffix)()
SmallSuffix.defaultProps = { size: 'lg' }
