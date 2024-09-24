import { style, keyframes } from '@vanilla-extract/css'
import { theme } from 'ui'

const slideInd = keyframes({
  from: {
    transform: 'translateY(-60%)',
    opacity: 0,
  },
  to: {
    transform: 'translateY(0)',
    opacity: 1,
  },
})

export const TOAST_BG_COLOR = theme.colors.signalGreenFill
export const toast = style({
  width: 'min(35ch, 90vw)',
  maxWidth: 'max-content',
  borderRadius: theme.radius.sm,
  paddingBlock: theme.space.xs,
  paddingInline: theme.space.sm,
  backgroundColor: TOAST_BG_COLOR,
  pointerEvents: 'none',
  lineHeight: '1.2',
  '@media': {
    '(prefers-reduced-motion: no-preference)': {
      animation: `${slideInd} 0.3s ease-out`,
    },
  },
})
