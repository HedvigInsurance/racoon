import { style } from '@vanilla-extract/css'
import { tokens, minWidth, hoverStyles } from 'ui'

export const emptyCart = style({
  gridColumn: '1 / -1',
  columnGap: tokens.space.md,
  paddingTop: tokens.space.xxxl,
  paddingBottom: tokens.space[9],
  '@media': {
    [minWidth.sm]: {
      gridColumn: '4 / span 6',
    },
    [minWidth.md]: {
      gridColumn: '5 / span 4',
      paddingBlock: tokens.space[10],
    },
  },
})

export const productsGrid = style({
  gridColumn: '1 / -1',
  display: 'grid',
  gap: tokens.space.md,
  paddingBottom: tokens.space[10],
  gridTemplateColumns: 'minmax(min-content, 1fr)',
  '@media': {
    [minWidth.sm]: {
      justifyContent: 'start',
      gridTemplateColumns: 'repeat(auto-fill, minmax(18rem, 1fr))',
    },
    [minWidth.md]: {
      gridTemplateColumns: 'repeat(auto-fill, minmax(20rem, 1fr))',
    },
    [minWidth.lg]: {
      gridColumn: '2 / span 10',
    },
    [minWidth.xl]: {
      gridColumn: '3 / span 8',
    },
  },
})

export const productGridItem = style({
  display: 'flex',
  alignItems: 'center',
  gap: tokens.space.md,
  padding: tokens.space.xs,
  borderRadius: tokens.radius.xl,
  ...hoverStyles({
    cursor: 'pointer',
    backgroundColor: tokens.colors.grayTranslucent100,
  }),
  '@media': {
    [minWidth.md]: {
      padding: tokens.space.md,
    },
  },
})
