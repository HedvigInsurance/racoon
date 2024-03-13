import { style } from '@vanilla-extract/css'
import { minWidth } from 'ui'

export const contentWrapper = style({
  paddingBlock: '3.5rem',

  '@media': {
    [minWidth.md]: {
      paddingBlock: '5rem',
    },
  },
})
