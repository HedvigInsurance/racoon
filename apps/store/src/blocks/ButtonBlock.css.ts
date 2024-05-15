import { style } from '@vanilla-extract/css'
import { themeVars } from 'ui/src/theme'

export const buttonWrapper = style({
  display: 'flex',
  justifyContent: 'center',
  paddingInline: themeVars.space.md,
})
