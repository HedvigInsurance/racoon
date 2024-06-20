import { style } from '@vanilla-extract/css'
import { minWidth, tokens } from 'ui/src/theme'

export const languageSelectForm = style({
  gridColumn: '1 / -1',

  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: tokens.space.md,

  '@media': {
    [minWidth.md]: {
      gridRow: 2,
      gridColumn: '7 / -1',
    },
    [minWidth.xxl]: {
      gridColumn: '7 / span 4',
    },
  },
})
