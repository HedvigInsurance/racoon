import { style } from '@vanilla-extract/css'
import { theme } from 'ui/src/theme'

export const buttonWrapper = style({
  display: 'flex',
  justifyContent: 'center',
  paddingInline: theme.space.md,
})
