import styled from '@emotion/styled'
import { motion } from 'framer-motion'
import { ChangeEventHandler, InputHTMLAttributes, useState } from 'react'
import { useHighlightAnimation } from '@/utils/useHighlightAnimation'

type BaseInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag'
>

type Props = BaseInputProps & {
  label: string
  variant?: 'small' | 'large'
}

export const TextField = ({ label, variant = 'large', ...props }: Props) => {
  const [value, setValue] = useState(props.defaultValue || '')
  const { highlight, animationProps } = useHighlightAnimation()

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setValue(event.target.value)
    props.onChange?.(event)
  }

  const inputValue = props.value || value

  const [Wrapper, Label, Input] =
    variant === 'large'
      ? [LargeWrapper, LargeLabel, LargeInput]
      : [SmallWrapper, SmallLabel, SmallInput]

  return (
    <Wrapper {...animationProps} active={!!inputValue}>
      <Label htmlFor={props.id}>{label}</Label>
      <Input {...props} onKeyDown={highlight} onChange={handleChange} />
    </Wrapper>
  )
}

type WrapperProps = { active: boolean }

const LargeWrapper = styled(motion.div)<WrapperProps>(({ theme, active }) => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.radius.sm,
  backgroundColor: theme.colors.gray300,

  height: '4rem',

  [':focus-within > label']: {
    transform: `translate(calc(${theme.space[4]} * 0.4), -0.1rem) scale(0.6)`,
  },

  ...(active && {
    '> label': {
      transform: `translate(calc(${theme.space[4]} * 0.4), -0.1rem) scale(0.6)`,
    },
  }),
}))

const LargeLabel = styled.label(({ theme }) => ({
  position: 'absolute',
  pointerEvents: 'none',
  transformOrigin: 'top left',
  transition: 'transform 200ms cubic-bezier(0, 0, 0.2, 1) 0ms',
  transform: `translate(0, 0) scale(1)`,

  fontSize: theme.fontSizes[5],
  color: theme.colors.gray700,
  padding: theme.space[4],
  whiteSpace: 'nowrap',
}))

const LargeInput = styled.input(({ theme }) => ({
  width: '100%',
  fontSize: theme.fontSizes[5],
  padding: theme.space[4],
  paddingTop: theme.space[5],

  ':disabled': {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
}))

const SmallWrapper = styled(LargeWrapper)(({ theme, active }) => ({
  height: '3.5rem',

  [':focus-within > label']: {
    transform: `translate(calc(${theme.space[4]} * 0.2), -0.4rem) scale(0.8)`,
  },

  ...(active && {
    '> label': {
      transform: `translate(calc(${theme.space[4]} * 0.2), -0.4rem) scale(0.8)`,
    },
  }),
}))

const SmallLabel = styled(LargeLabel)(({ theme }) => ({
  fontSize: theme.fontSizes[3],
  paddingTop: theme.space[4],
}))

const SmallInput = styled(LargeInput)(({ theme }) => ({
  fontSize: theme.fontSizes[4],
  paddingTop: theme.space[5],
}))
