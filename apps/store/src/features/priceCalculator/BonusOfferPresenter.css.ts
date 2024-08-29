import { style } from '@vanilla-extract/css'
import { tokens } from 'ui'

export const actions = style({
  display: 'grid',
  gridAutoFlow: 'column',
  gridAutoColumns: '1fr',
  gap: tokens.space.sm,
})
