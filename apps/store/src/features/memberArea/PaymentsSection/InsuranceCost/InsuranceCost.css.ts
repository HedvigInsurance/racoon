import { style } from '@vanilla-extract/css'
import { tokens } from 'ui/src/theme/theme.css'

export const costInfo = style({
  display: 'grid',
  gridTemplateColumns: '1fr auto',
  alignItems: 'baseline',
  justifyItems: 'start',
  paddingBlock: tokens.space.sm,
  paddingInline: tokens.space.md,
  backgroundColor: tokens.colors.opaque1,
  borderRadius: tokens.radius.md,
})
