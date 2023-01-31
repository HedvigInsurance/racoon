import { colors, UIColorKeys } from './colors/colors'
import { effects } from './effects'
import { radius } from './radius'
import { space } from './space'
import { fonts, fontSizes } from './typography'

export const theme = {
  colors,
  fonts,
  fontSizes,
  radius,
  space,
  effects,
} as const

export const getColor = (color: UIColorKeys) => {
  return theme.colors[color]
}
