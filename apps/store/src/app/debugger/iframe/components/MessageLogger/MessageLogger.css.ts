import { style } from '@vanilla-extract/css'
import { theme } from 'ui'

export const wrapper = style({
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: theme.colors.borderOpaque1,
  overflowY: 'auto',
})

export const messageLog = style({
  padding: theme.space.xs,
  borderBottomWidth: 1,
  borderBottomStyle: 'solid',
  borderBottomColor: theme.colors.borderOpaque1,
})
