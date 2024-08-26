import { style } from '@vanilla-extract/css'
import { minWidth } from 'ui'

export const wrapper = style({
  paddingTop: '5rem',

  '@media': {
    [minWidth.lg]: {
      paddingTop: '6.5rem',
    },
  },
})

export const gridRoot = style({
  rowGap: '5rem',
})
