import { colors, UIColor } from './colors'
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

type CustomTheme = typeof theme

// Need to define Theme interface, since default is empty
// https://emotion.sh/docs/typescript
declare module '@emotion/react' {
  export interface Theme extends CustomTheme {}
}

export const getColor = (color: UIColor) => {
  return theme.colors[color]
}
