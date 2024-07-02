import { style } from '@vanilla-extract/css'
import { tokens } from 'ui/src/theme'

export const dialogContent = style({
  position: 'fixed',
  top: '44vh',
  transform: 'translateY(-50%)',
  width: '100%',
})

export const dialogWindow = style({
  width: '100%',
  maxWidth: '23rem',
  marginInline: 'auto',
  borderRadius: tokens.radius.md,
})
