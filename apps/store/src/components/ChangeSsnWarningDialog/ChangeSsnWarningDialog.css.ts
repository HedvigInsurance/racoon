import { style } from '@vanilla-extract/css'
import { tokens } from 'ui'

export const title = style({
  gap: tokens.space.xs,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
})
