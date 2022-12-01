import styled from '@emotion/styled'
import { motion } from 'framer-motion'
import { InputHTMLAttributes, useState, KeyboardEvent } from 'react'
import { theme } from 'ui'

const Input = styled(motion.input)(({ theme }) => ({
  width: '100%',
  fontSize: theme.fontSizes[5],
  padding: `${theme.space[3]} ${theme.space[4]}`,
  borderRadius: theme.radius.sm,
  backgroundColor: theme.colors.gray300,
  color: theme.colors.gray900,

  ':focus': {
    outline: `1px solid ${theme.colors.gray500}`,
  },
  '::placeholder': {
    color: theme.colors.gray600,
  },
}))

enum AnimationState {
  Idle = 'IDLE',
  Active = 'ACTIVE',
}

const animationVariants = {
  [AnimationState.Active]: { backgroundColor: 'rgba(197, 236, 127, 0.6)' },
  [AnimationState.Idle]: { backgroundColor: theme.colors.gray300 },
} as const

type Props = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag'
>

export const TextField = (props: Props) => {
  const [isTyping, setIsTyping] = useState(false)

  const handleAnimate = (event: KeyboardEvent<HTMLInputElement>) => {
    props.onKeyDown?.(event)
    setIsTyping(true)
  }

  return (
    <Input
      {...props}
      onKeyDown={(event) => handleAnimate(event)}
      variants={animationVariants}
      initial={AnimationState.Idle}
      animate={isTyping ? AnimationState.Active : AnimationState.Idle}
      onAnimationComplete={() => {
        setIsTyping(false)
      }}
    />
  )
}
