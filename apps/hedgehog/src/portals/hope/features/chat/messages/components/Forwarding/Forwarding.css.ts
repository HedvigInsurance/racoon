import { theme } from '@hedvig-ui/redesign/theme'
import { style } from '@vanilla-extract/css'

export const css = {
  container: style({
    cursor: 'pointer',
    padding: theme.space.xs,
    paddingInline: theme.space.md,
    paddingBottom: `calc(${theme.space.xs} + ${theme.space.xs})`,
    marginBottom: `-${theme.space.xs}`,
    marginInline: theme.space.md,
    backgroundColor: theme.colors.translucent1,
    borderRadius: theme.radius.md,
  }),
  text: style({
    fontSize: theme.fontSizes.xs,
    color: theme.colors.textSecondaryOnGray,
  }),
}
