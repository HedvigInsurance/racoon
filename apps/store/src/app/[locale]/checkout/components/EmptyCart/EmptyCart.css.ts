import { style } from '@vanilla-extract/css'
import { minWidth, tokens } from 'ui'

export const productsGrid = style({
  display: 'grid',
  padding: tokens.space.lg,
  gap: tokens.space.md,
  paddingBottom: tokens.space[10],
  gridTemplateColumns: 'minmax(min-content, 1fr)',
  maxWidth: '75rem',
  marginInline: 'auto',

  '@media': {
    [minWidth.sm]: {
      gridTemplateColumns: 'repeat(auto-fill, minmax(19rem, 1fr))',
    },
  },
})

export const productLinkCard = style({
  ':hover': {
    backgroundColor: tokens.colors.translucent1,
  },
})
