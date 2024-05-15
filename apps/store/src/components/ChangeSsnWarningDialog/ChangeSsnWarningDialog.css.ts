import { style } from '@vanilla-extract/css'
import { themeVars } from 'ui/src/theme'

export const title = style({
  gap: themeVars.space.xs,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
})
