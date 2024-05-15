import { style } from '@vanilla-extract/css'
import { minWidth, tokens } from 'ui'

export const link = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: tokens.space.sm,
  padding: `${tokens.space.sm} ${tokens.space.md}`,
  borderRadius: tokens.radius.sm,

  ':focus': {
    backgroundColor: tokens.colors.grayTranslucent100,
  },
})

export const pillow = style({
  '@media': {
    [minWidth.lg]: {
      height: '6rem',
      width: '6rem',
    },
  },
})
