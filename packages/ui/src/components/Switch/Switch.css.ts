import { style } from '@vanilla-extract/css'
import { tokens } from '../../theme'

export const switchStyles = style({
  boxSizing: 'border-box',
  width: '1.75rem',
  height: '1.125rem',
  borderRadius: 9999,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',

  backgroundColor: tokens.colors.opaque3,
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: 'transparent',

  ':focus-visible': {
    borderColor: tokens.colors.gray1000,
  },

  selectors: {
    '&[data-state=checked], &[data-state=open]': {
      backgroundColor: tokens.colors.signalGreenElement,
    },

    '&[disabled]': {
      backgroundColor: tokens.colors.opaque3,
      cursor: 'not-allowed',
    },
  },
})

export const thumbStyles = style({
  width: '1rem',
  height: '1rem',
  borderRadius: '100%',
  backgroundColor: tokens.colors.textNegative,

  transition: 'transform 100ms',
  transform: 'translateX(0)',
  willChange: 'transform',

  selectors: {
    '&[data-state=checked]': {
      transform: 'translateX(0.6rem)',
    },
  },
})
