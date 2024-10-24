import { style } from '@vanilla-extract/css'
import { tokens } from 'ui/src/theme/theme.css'

export const wrapper = style({
  display: 'grid',
  gridTemplateColumns: '1fr minmax(33%, min-content)',
  gap: tokens.space.xs,
})

export const button = style({
  minWidth: 'auto',
})
