import { style } from '@vanilla-extract/css'
import { pillowSize, responsiveStyles, tokens } from 'ui'

export const pillow = style({
  vars: {
    [pillowSize]: '4rem',
  },
  ...responsiveStyles({
    lg: { vars: { [pillowSize]: '13rem' } },
  }),
})

export const priceLabel = style({
  // Make sure there's no layout shift when price appears
  minHeight: tokens.space.lg,
})
