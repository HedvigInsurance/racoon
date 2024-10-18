import { style } from '@vanilla-extract/css'
import { tokens } from 'ui/src/theme/theme.css'

export const buttonWrapper = style({
  display: 'flex',
  justifyContent: 'center',
  paddingInline: tokens.space.md,
})
