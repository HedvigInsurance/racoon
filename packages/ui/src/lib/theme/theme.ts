import { colors, UIColorKeys } from './colors/colors'
import { radius } from './radius'
import { space } from './space'
import { transitions } from './transitions'
import { fonts, fontSizes } from './typography'

export const theme = {
  colors,
  fonts,
  fontSizes,
  radius,
  space,
  transitions,
} as const

export const getColor = (color: UIColorKeys) => {
  return theme.colors[color]
}
