import { useTheme } from '@emotion/react'
import { KeyboardEvent, useCallback, useState } from 'react'

enum AnimationState {
  Idle = 'IDLE',
  Active = 'ACTIVE',
}

export const useHighlightAnimation = () => {
  const theme = useTheme()
  const [isInteractive, setIsInteractive] = useState(false)

  const animationVariants = {
    [AnimationState.Active]: { backgroundColor: 'rgba(197, 236, 127, 0.6)' },
    [AnimationState.Idle]: { backgroundColor: theme.colors.gray300 },
  } as const

  const highlight = useCallback((event?: KeyboardEvent<HTMLElement>) => {
    if (event && !EXCLUDE_SET.has(event.key)) setIsInteractive(true)
  }, [])

  return {
    highlight,
    animationProps: {
      variants: animationVariants,
      initial: AnimationState.Idle,
      animate: isInteractive ? AnimationState.Active : AnimationState.Idle,
      onAnimationComplete: () => setIsInteractive(false),
    },
  } as const
}

const EXCLUDE_SET = new Set([
  'Tab',
  'Enter',
  'ArrowDown',
  'ArrowUp',
  'ArrowRight',
  'ArrowLeft',
  'Shift',
])
