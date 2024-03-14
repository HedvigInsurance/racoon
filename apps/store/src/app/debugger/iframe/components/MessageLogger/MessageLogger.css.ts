import { style } from '@vanilla-extract/css'
import { theme } from 'ui'

export const wrapper = style({
  overflowY: 'auto',
  border: `1px solid ${theme.colors.borderOpaque1}`,
})

export const messageLog = style({
  padding: theme.space.xs,
  borderBottom: `1px solid ${theme.colors.borderOpaque1}`,
})
