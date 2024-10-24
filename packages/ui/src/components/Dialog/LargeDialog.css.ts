import { style } from '@vanilla-extract/css'
import { minWidth, tokens } from '../../theme'

export const closeButton = style({
  position: 'absolute',
  right: tokens.space.lg,
  top: tokens.space.lg,
})

export const content = style({
  display: 'flex',
  width: '100%',
})

export const card = style({
  position: 'relative',
  marginBlock: 'auto',
  marginInline: tokens.space.md,
  width: '100%',
  maxHeight: `calc(100vh - (${tokens.space.md}) * 2)`,
  // If card has header inside, then other content should generally have its own wrapper with overflowY: 'auto'
  // to make header and close button sticky. This is a fallback for dialogs which don't have a header
  overflowY: 'auto',
  padding: tokens.space.lg,

  '@media': {
    [minWidth.sm]: {
      marginBlock: 'auto',
      marginInline: 'auto',
      maxWidth: 'min(60rem, 80%)',
    },
  },
})

export const heading = style({
  marginRight: tokens.space.xl,
})

export const scrollableInnerContent = style({
  overflowY: 'auto',
})
