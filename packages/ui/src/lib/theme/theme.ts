import { colors, UIColor } from './colors/colors'
import { radius } from './radius'
import { space } from './space'
import { fonts, fontSizes } from './typography'

export const theme = {
  colors,
  fonts,
  fontSizes,
  radius,
  space,
}

export const getColor = (color: UIColor) => {
  return theme.colors[color]
}
