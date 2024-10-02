import { style } from '@vanilla-extract/css'
import { tokens } from 'ui'

export const bar = style({
  width: '100%',
  height: tokens.space.xxs,
  marginInline: 'auto',
  marginBlock: tokens.space.xxs,
  backgroundColor: tokens.colors.translucent2,
  borderRadius: tokens.radius.xxs,
})

export const progressBar = style({
  height: '100%',
  backgroundColor: tokens.colors.gray1000,
  borderRadius: tokens.radius.xxs,
})
