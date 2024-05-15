import { style } from '@vanilla-extract/css'
import { themeVars } from 'ui'

export const wrapper = style({
  overflowY: 'auto',
  border: `1px solid ${themeVars.colors.borderOpaque1}`,
})

export const messageLog = style({
  padding: themeVars.space.xs,
  borderBottom: `1px solid ${themeVars.colors.borderOpaque1}`,
})
