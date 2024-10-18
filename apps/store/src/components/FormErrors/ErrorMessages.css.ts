import { style } from '@vanilla-extract/css'
import { tokens } from 'ui/src/theme/theme.css'

export const header = style({
  marginTop: tokens.space.xs,
  marginBottom: tokens.space.xxs,
})

export const warningIcon = style({
  display: 'inline-block',
})

export const heading = style({
  display: 'inline-block',
  marginInlineStart: tokens.space.xxs,
})
