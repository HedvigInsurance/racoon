import { theme } from '@hedvig-ui/redesign/theme'
import { style } from '@vanilla-extract/css'

export const css = {
  form: style({
    minWidth: '600px',
    padding: theme.space.lg,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.space.lg,
  }),
  listContainer: style({
    padding: theme.space.md,
    width: '100%',
  }),
}
