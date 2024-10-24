import { style } from '@vanilla-extract/css'
import { tokens } from 'ui/src/theme/theme.css'

export const list = style({
  position: 'relative',
  // Add slight offset since line-height and height are not the same
  top: '0.1em',
  height: '1.4em',
  overflow: 'hidden',
})

export const listItem = style({
  position: 'absolute',
  inset: 0,
})

export const tickerItemWrapper = style({
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: tokens.space.xs,
})
