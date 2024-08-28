import { keyframes, style } from '@vanilla-extract/css'

export const content = style({
  minWidth: '400px',
  minHeight: '400px',
})

export const loadingIndicator = style({
  position: 'absolute',
  insetInline: 0,
  insetBlock: 0,
  display: 'flex',
  placeItems: 'center',
})

const fadeIn = keyframes({
  '0%': { opacity: '0' },
  '100%': { opacity: '1' },
})

export const form = style({
  opacity: 0,
  animation: `${fadeIn} 300ms forwards`,
})
