import { style } from '@vanilla-extract/css'
import { themeVars } from 'ui'

export const header = style({
  marginTop: themeVars.space.xs,
  marginBottom: themeVars.space.xxs,
})

export const warningIcon = style({
  display: 'inline-block',
})

export const heading = style({
  display: 'inline-block',
  marginInlineStart: themeVars.space.xxs,
})
