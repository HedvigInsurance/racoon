import { style } from '@vanilla-extract/css'

export const link = style({
  display: 'inline-block',
  selectors: {
    '&:active': { opacity: 0.75 },
  },
})
