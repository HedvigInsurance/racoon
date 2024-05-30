import { style } from '@vanilla-extract/css'
import { minWidth, tokens } from 'ui'
import { MAX_WIDTH } from '../GridLayout/GridLayout.constants'

export const productGrid = style({
  display: 'grid',
  rowGap: tokens.space.xxxl,
  columnGap: tokens.space.xs,
  alignItems: 'end',
  gridTemplateColumns: `repeat(auto-fit, minmax(20rem, 1fr))`,
  maxWidth: MAX_WIDTH,
  marginInline: 'auto',
  paddingInline: tokens.space.md,

  '@media': {
    [minWidth.md]: {
      rowGap: tokens.space.xl,
      columnGap: tokens.space.md,
    },
    [minWidth.lg]: {
      paddingInline: tokens.space.lg,
    },
  },
})
