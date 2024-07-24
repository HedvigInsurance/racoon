import { style } from '@vanilla-extract/css'
import { tokens } from 'ui'

export const grayCard = style({
  backgroundColor: tokens.colors.gray100,
  borderRadius: tokens.radius.xxs,
  padding: tokens.space.md,
})
