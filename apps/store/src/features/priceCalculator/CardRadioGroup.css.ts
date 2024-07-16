import { style } from '@vanilla-extract/css'
import { tokens } from 'ui'

export const item = style({
  borderRadius: tokens.radius.md,
  backgroundColor: tokens.colors.opaque1,
  padding: tokens.space.md,
  selectors: {
    '&[data-state=checked]': {
      backgroundColor: tokens.colors.buttonPrimary,
      vars: {
        [tokens.colors.textPrimary]: tokens.colors.textNegative,
        [tokens.colors.textSecondary]: tokens.colors.gray500,
      },
    },
  },
})
