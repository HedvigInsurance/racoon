import { style } from '@vanilla-extract/css'
import { tokens, minWidth, yStack } from 'ui'

export const layout = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(12, 1fr)',
  columnGap: tokens.space.md,
  paddingInline: tokens.space.md,
  '@media': {
    [minWidth.lg]: {
      paddingInline: tokens.space.lg,
    },
  },
})

export const content = style([
  yStack({
    gap: 'lg',
  }),
  {
    gridColumn: '1 / -1',
    columnGap: tokens.space.md,
    paddingBottom: tokens.space[10],
    paddingTop: tokens.space.xxl,
    '@media': {
      [minWidth.sm]: {
        gridColumn: '3 / span 8',
      },
      [minWidth.lg]: {
        gridColumn: '4 / span 6',
      },
      [minWidth.xl]: {
        gridColumn: '5 / span 4',
      },
    },
  },
])

export const headings = style({
  maxWidth: '35ch',
  marginInline: 'auto',
  marginBottom: tokens.space.md,
})
