import { Variants } from 'framer-motion'
import { KeyboardEvent, useCallback, useState } from 'react'
import { theme } from 'ui'

enum AnimationState {
  Idle = 'IDLE',
  Active = 'ACTIVE',
}

export const useHighlightAnimation = () => {
  const [isInteractive, setIsInteractive] = useState(false)

  const highlight = useCallback((event?: KeyboardEvent<HTMLElement>) => {
    if (!event) return setIsInteractive(true)
    if (!EXCLUDE_SET.has(event.key)) setIsInteractive(true)
  }, [])

  return {
    highlight,
    animationProps: {
      variants: ANIMATION_VARIANTS,
      initial: AnimationState.Idle,
      animate: isInteractive ? AnimationState.Active : AnimationState.Idle,
      transition: { ...theme.transitions.framer.easeInOutCubic, duration: 0.2, delay: 0.2 },
      onAnimationComplete: () => setIsInteractive(false),
      'data-highlight': isInteractive,
    },
  } as const
}

const ANIMATION_VARIANTS: Variants = {
  [AnimationState.Active]: {
    backgroundColor: theme.colors.green100,
    transition: { ...theme.transitions.framer.easeInOutCubic, duration: 0.4 },
  },
} as const

const EXCLUDE_SET = new Set([
  'Tab',
  'Enter',
  'ArrowDown',
  'ArrowUp',
  'ArrowRight',
  'ArrowLeft',
  'Shift',
  'Alt',
  'Meta',
  'Control',
])
