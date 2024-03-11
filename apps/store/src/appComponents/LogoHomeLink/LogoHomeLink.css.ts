import { style } from '@vanilla-extract/css'

export const logoStyle = style({
  display: 'inline-block',
  ':active': { opacity: 0.75 },
})
