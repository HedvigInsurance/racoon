import { style } from '@vanilla-extract/css'
import { minWidth } from 'ui/src/theme'

export const animationWrapper = style({
  width: '5rem',
  height: '5rem',
  marginInline: 'auto',
  '@media': {
    [minWidth.md]: {
      width: '7.5rem',
      height: '7.5rem',
    },
  },
})
