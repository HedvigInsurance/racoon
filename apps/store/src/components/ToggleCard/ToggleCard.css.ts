import { style } from '@vanilla-extract/css'
import { tokens } from 'ui'

export const wrapper = style({
  padding: tokens.space.md,
  paddingTop: tokens.space.sm,
  borderRadius: tokens.radius.md,
  backgroundColor: tokens.components.input.background.default,
})

export const checkboxHeader = style({
  display: 'flex',
  gap: tokens.space.sm,
  justifyContent: 'space-between',
  alignItems: 'center',
})

export const labelText = style({
  fontFamily: tokens.fonts.body,
  fontSize: tokens.fontSizes.md,
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
})
