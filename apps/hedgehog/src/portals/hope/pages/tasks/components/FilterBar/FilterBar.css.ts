import { theme } from '@hedvig-ui/redesign/theme'
import { style } from '@vanilla-extract/css'

export const css = {
  FilterBar: style({
    display: 'flex',
    gap: theme.space.md,
    justifyContent: 'space-between',

    paddingBlock: theme.space.sm,
    paddingInline: theme.space.md,
  }),
}
