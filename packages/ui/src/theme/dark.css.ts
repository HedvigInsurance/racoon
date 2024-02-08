import { style } from '@vanilla-extract/css'
import { colors } from './colors/colors'
import { bodyBgColor, bodyTextColor, headerBgTransparentColor } from './vars.css'

export const dark = style({
  vars: {
    [bodyBgColor]: colors.dark,
    [bodyTextColor]: colors.textNegative,
    [headerBgTransparentColor]: 'hsla(0, 0%, 7%, 0)',
  },
  color: bodyTextColor,
  backgroundColor: bodyBgColor,
})
