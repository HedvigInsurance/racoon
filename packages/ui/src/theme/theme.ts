import { createTheme } from '@vanilla-extract/css'
import type { UIColorKeys } from './colors/colors'
import { colors } from './colors/colors'
import { radius } from './radius'
import { space } from './space'
import { transitions } from './transitions'
import { fonts, fontSizes } from './typography'

export { framerTransitions } from './transitions'

export const theme = {
  colors,
  fonts,
  fontSizes,
  radius,
  space,
  transitions,
  shadow: {
    default: '0 1px 2px 0 rgb(0 0 0 / 15%)',
    focus: `0 0 0 2px ${colors.textPrimary}`,
    focusAlt: `0 0 0 2px ${colors.signalBlueElement}`,
  },
} as const

export const [mainTheme, themeVars] = createTheme(theme)

export const getColor = (color: UIColorKeys) => {
  return theme.colors[color]
}
