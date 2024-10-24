import { style } from '@vanilla-extract/css'
import { tokens } from 'ui/src/theme/theme.css'

export const wrapper = style({
  display: 'flex',
  gap: tokens.space.xxxs,
})
