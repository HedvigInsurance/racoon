import { style } from '@vanilla-extract/css'
import { theme } from '../theme'

export const action = style({
  all: 'unset',
  boxSizing: 'border-box',
  padding: theme.space.xxs,

  ':hover': {
    background: 'none',
  },
})

export const sideContent = style({
  marginInlineEnd: `calc(${theme.space.xxs} * -1)`,
})
