import { style } from '@vanilla-extract/css'
import { themeVars } from 'ui/src/theme'
import { inputBgColor } from 'ui/src/theme/vars.css'

export const wrapper = style({
  padding: themeVars.space.md,
  paddingTop: themeVars.space.sm,
  borderRadius: themeVars.radius.md,
  backgroundColor: inputBgColor,
})

export const checkboxHeader = style({
  display: 'flex',
  gap: themeVars.space.sm,
  justifyContent: 'space-between',
  alignItems: 'center',
})

export const labelText = style({
  fontFamily: themeVars.fonts.body,
  fontSize: themeVars.fontSizes.md,
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
})
