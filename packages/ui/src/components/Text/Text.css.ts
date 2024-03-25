import { style } from '@vanilla-extract/css'

export const textBase = style({
  whiteSpace: 'pre-wrap',
  color: 'inherit',
})

export const textStrikethrough = style({
  textDecorationLine: 'line-through',
})

export const textUppercase = style({
  textTransform: 'uppercase',
})
