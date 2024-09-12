import { style } from '@vanilla-extract/css'
import { pillowSize, responsiveStyles } from 'ui'

export const pillow = style({
  vars: {
    [pillowSize]: '4rem',
  },
  ...responsiveStyles({
    lg: { vars: { [pillowSize]: '13rem' } },
  }),
})
