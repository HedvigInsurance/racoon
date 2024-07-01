import { style } from '@vanilla-extract/css'
import { tokens } from 'ui/src/theme'

export const mobileWrapper = style({
  paddingTop: tokens.space.md,
  borderBottom: `1px solid ${tokens.colors.borderOpaque1}`,
})
