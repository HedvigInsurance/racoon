import { style } from '@vanilla-extract/css'
import { tokens } from 'ui/src/theme/theme.css'

export const wrapper = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: tokens.space.md,
  marginBottom: tokens.space.xl,
})

export const disclaimerText = style({
  paddingInline: tokens.space.md,
})
