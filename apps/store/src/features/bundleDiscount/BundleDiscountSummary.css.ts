import { style } from '@vanilla-extract/css'
import { hoverStyles } from 'ui/src/theme'

export const readMoreLink = style({
  textDecoration: 'underline',
  ...hoverStyles({
    opacity: 0.7,
  }),
})
