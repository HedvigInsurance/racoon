import { style } from '@vanilla-extract/css'
import { themeVars } from 'ui/src/theme'

export const wrapper = style({
  display: 'flex',
  gap: themeVars.space.xxxs,
})
