import { style } from '@vanilla-extract/css'
import { responsiveStyles } from 'ui'
import { pillowSize } from '@/components/Pillow/Pillow.css'

export const pillow = style({
  vars: {
    [pillowSize]: '4rem',
  },
  ...responsiveStyles({
    lg: { vars: { [pillowSize]: '13rem' } },
  }),
})
