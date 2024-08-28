import { theme } from '@hedvig-ui/redesign/theme'
import { style } from '@vanilla-extract/css'

export const itemType = style({
  fontSize: theme.fontSizes.md,
  marginBottom: theme.space.xs,
})

export const removalConfirmationDescription = style({
  color: theme.colors.textSecondary,
})
