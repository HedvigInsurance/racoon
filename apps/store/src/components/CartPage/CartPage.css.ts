import { style } from '@vanilla-extract/css'
import { hoverStyles } from 'ui'

export const link = style({
  color: 'inherit',
  ...hoverStyles({
    textDecoration: 'underline',
  }),
})
