import { theme } from '@hedvig-ui/redesign/theme'
import { style } from '@vanilla-extract/css'

export const css = {
  heading: style({
    fontSize: theme.fontSizes.xl,
    marginBottom: theme.space.xs,
  }),
  headingDescription: style({
    color: theme.colors.textSecondary,
  }),
  permissionMessage: style({
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    textAlign: 'right',
  }),
}
