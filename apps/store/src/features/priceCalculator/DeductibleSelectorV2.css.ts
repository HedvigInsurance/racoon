import { style } from '@vanilla-extract/css'
import { tokens } from 'ui'
import { labelBackground } from '@/features/priceCalculator/CardRadioGroup.css'

export const priceLabel = style({
  paddingBlock: tokens.space.xxs,
  paddingInline: tokens.space.xs,
  borderRadius: tokens.radius.xs,
  backgroundColor: labelBackground,
})
