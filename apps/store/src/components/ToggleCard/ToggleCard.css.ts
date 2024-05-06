import { style, fallbackVar } from '@vanilla-extract/css'
import { theme } from 'ui/src/theme'
import { inputBgColor } from 'ui/src/theme/vars.css'

const bgColor = fallbackVar(inputBgColor, theme.colors.opaque1)

export const wrapper = style({
  padding: theme.space.md,
  paddingTop: theme.space.sm,
  borderRadius: theme.radius.md,
  backgroundColor: bgColor,
})

export const checkboxHeader = style({
  display: 'flex',
  gap: theme.space.sm,
  justifyContent: 'space-between',
  alignItems: 'center',
})

export const labelText = style({
  fontFamily: theme.fonts.body,
  fontSize: theme.fontSizes.md,
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
})
