import { style } from '@vanilla-extract/css'
import { hoverStyles, tokens } from 'ui'

export const textLink = style({
  textDecorationLine: 'underline',
  textDecorationColor: tokens.colors.gray400,
  textDecorationThickness: 'clamp(1px, 0.07em, 2px);',
  textUnderlineOffset: 5,

  ...hoverStyles({
    textDecorationColor: 'var(--random-hover-color)',
  }),
})
