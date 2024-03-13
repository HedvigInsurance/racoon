import { style } from '@vanilla-extract/css'
import { minWidth } from 'ui'

export const contentWrapper = style({
  paddingTop: '3.5rem',

  '@media': {
    [minWidth.md]: {
      paddingTop: '5rem',
    },
  },
})
