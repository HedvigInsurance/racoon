import { style } from '@vanilla-extract/css'
import { theme } from 'ui/src/theme'

export const title = style({
  gap: theme.space.xs,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
})
