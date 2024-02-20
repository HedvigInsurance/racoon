import { style } from '@vanilla-extract/css'
import { theme } from 'ui/src/theme'

export const wrapper = style({
  width: 'min(29rem, 100%)',
  marginInline: 'auto',
  paddingInline: theme.space.md,
})

export const innerWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
})
