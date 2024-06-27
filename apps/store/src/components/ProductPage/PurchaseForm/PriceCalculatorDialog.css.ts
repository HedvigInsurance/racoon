import { style } from '@vanilla-extract/css'
import { tokens } from 'ui/src/theme'

export const dialogTitle = style({
  paddingTop: tokens.space.xxxl,
})

export const dialogContent = style({
  position: 'relative',
  height: '100%',
  overflow: 'auto',
  padding: tokens.space.md,
  backgroundColor: 'transparent',
  isolation: 'isolate',
})

export const iconButton = style({
  position: 'absolute',
  top: 0,
  right: 0,
  padding: '1rem',
  lineHeight: 0,
  cursor: 'pointer',
})
