import { style } from '@vanilla-extract/css'

export const toggleIndicator = style({
  all: 'unset',
  boxSizing: 'border-box',
  transition: 'rotate 150ms cubic-bezier(1, 0, 0, 1)',
})

export const toggleIndicatorOpen = style({
  rotate: '180deg',
})
