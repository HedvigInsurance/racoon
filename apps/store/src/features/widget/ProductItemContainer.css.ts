import { assignVars, style } from '@vanilla-extract/css'
import { tokens } from 'ui'

// This makes sure inputs used inside ProductItem card has the correct
// background color when used in the context of ProductItemContainer
// Next step is to reassign these tokens on a `layer` level
export const productItem = style({
  vars: assignVars(tokens.components.input.background, {
    default: tokens.colors.backgroundStandard,
    selected: tokens.colors.opaque1,
  }),
})

export const compareButtonWrapper = style({
  padding: tokens.space.md,
})
