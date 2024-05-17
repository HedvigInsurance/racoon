import { style } from '@vanilla-extract/css'
import { theme } from 'ui/src/theme'

export const bundleDiscountSummary = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',

  backgroundColor: theme.colors.signalGreenFill,
  border: `1px solid ${theme.colors.grayTranslucent200}`,
  borderRadius: theme.radius.sm,

  padding: theme.space.sm,
  gap: theme.space.sm,
})
