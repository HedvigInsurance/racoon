import { style } from '@vanilla-extract/css'
import { theme, minWidth } from 'ui/src/theme'

export const wrapper = style({
  display: 'flex',
  gap: theme.space.xxxs,

  '@media': {
    [minWidth.md]: {
      gap: theme.space.xxs,
    },
  },
})
