import { style } from '@vanilla-extract/css'
import { tokens } from 'ui'

export const checkItemWrapper = style({
  display: 'grid  ',
  placeItems: 'center',
  height: tokens.space.lg,
  width: tokens.space.lg,
  color: tokens.colors.white,
  borderRadius: tokens.radius.xxs,
  backgroundColor: tokens.colors.textDisabled,
})

export const checkItemWrapperChecked = style({
  backgroundColor: tokens.colors.green600,
})
