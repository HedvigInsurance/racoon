import { style } from '@vanilla-extract/css'
import { theme } from 'ui/src/theme'

export const wrapper = style({
  display: 'flex',
  gap: theme.space.xxxs,
})
