import { style } from '@vanilla-extract/css'
import { themeVars } from 'ui/src/theme'

export const wrapper = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: themeVars.space.md,
  marginBottom: themeVars.space.xl,
})

export const disclaimerText = style({
  paddingInline: themeVars.space.md,
})
