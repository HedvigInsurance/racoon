import { style } from '@vanilla-extract/css'
import { tokens } from 'ui'

export const errorWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: tokens.space.md,
  gap: tokens.space.md,
})
