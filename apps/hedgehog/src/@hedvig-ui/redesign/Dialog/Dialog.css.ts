import { keyframes, style } from '@vanilla-extract/css'
import { theme } from '../theme'

const overlayEnter = keyframes({
  '0%': { opacity: 0 },
  '100%': { opacity: 1 },
})

const overlayExit = keyframes({
  '0%': { opacity: 1 },
  '100%': { opacity: 0 },
})

const contentEnter = keyframes({
  '0%': { opacity: 0, transform: 'translateY(-10%)' },
  '100%': { opacity: 1, transform: 'translateY(0)' },
})

const contentExit = keyframes({
  '0%': { opacity: 1, transform: 'translateY(0)' },
  '100%': { opacity: 0, transform: 'translateY(-10%)' },
})

const DURATION = '300ms'

export const overlay = style({
  width: '100vw',
  height: '100vh',
  background: theme.colors.grayTranslucent200,

  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 10,

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  padding: '3rem',

  selectors: {
    '&[data-state="open"]': {
      animationName: overlayEnter,
      animationDuration: DURATION,
    },
    '&[data-state="closed"]': {
      animationName: overlayExit,
      animationDuration: DURATION,
    },
  },
})

export const content = style({
  display: 'inline-block',
  maxWidth: '100%',
  maxHeight: '100%',
  boxShadow: `0 5px 40px ${theme.colors.translucent2}`,
  borderRadius: '12px',
  overflow: 'auto',
  background: theme.colors.backgroundStandard,

  selectors: {
    '&[data-state="open"]': {
      animationName: contentEnter,
      animationDuration: DURATION,
    },
    '&[data-state="closed"]': {
      animationName: contentExit,
      animationDuration: DURATION,
    },
  },
})
