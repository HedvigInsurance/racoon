import { style } from '@vanilla-extract/css'

export const textBase = style({
  whiteSpace: 'pre-wrap',
})

export const textFallbackColor = style({
  color: 'inherit',
})

export const textStrikethrough = style({
  textDecorationLine: 'line-through',
})

export const textUppercase = style({
  textTransform: 'uppercase',
})
