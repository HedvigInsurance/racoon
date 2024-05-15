import { style } from '@vanilla-extract/css'
import { tokens } from 'ui'

export const buttonWrapper = style({
  display: 'flex',
  justifyContent: 'center',
  paddingInline: tokens.space.md,
})
