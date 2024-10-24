import { style } from '@vanilla-extract/css'
import { tokens } from 'ui/src/theme/theme.css'

export const wrapper = style({
  overflowY: 'auto',
  border: `1px solid ${tokens.colors.borderOpaque1}`,
})

export const messageLog = style({
  padding: tokens.space.xs,
  borderBottom: `1px solid ${tokens.colors.borderOpaque1}`,
})
