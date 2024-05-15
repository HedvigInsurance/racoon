import { style } from '@vanilla-extract/css'
import { tokens } from 'ui'

export const wrapper = style({
  display: 'flex',
  gap: tokens.space.xxxs,
})
