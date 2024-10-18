import { style } from '@vanilla-extract/css'
import { breakpoints, minWidth, tokens } from '../../theme'

export const closeButton = style({
  position: 'absolute',
  right: tokens.space.md,
  top: tokens.space.md,
})

export const content = style({
  display: 'flex',
  width: '100%',
})

export const card = style({
  position: 'relative',
  marginBlock: 'auto',
  marginInline: 'auto',
  width: '100%',

  '@media': {
    // This is unusual, we normally target min-width instead
    [`screen and (max-width: ${breakpoints.xs}px)`]: {
      boxShadow: 'none',
      borderRadius: 0,
      border: 'none',
      minHeight: '100vh',
    },
    [minWidth.sm]: {
      maxWidth: '80%',
    },
  },
})

export const heading = style({
  marginRight: tokens.space.lg,
})
