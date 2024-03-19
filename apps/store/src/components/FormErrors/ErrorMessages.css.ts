import { style } from '@vanilla-extract/css'
import { theme } from 'ui'

export const header = style({
  marginTop: theme.space.xs,
  marginBottom: theme.space.xxs,
})

export const warningIcon = style({
  display: 'inline-block',
})

export const heading = style({
  display: 'inline-block',
  marginInlineStart: theme.space.xxs,
})
