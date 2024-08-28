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
  shadow: {
    default: '0 1px 2px 0 rgb(0 0 0 / 15%)',
    focus: `0 0 0 2px ${colors.textPrimary}`,
    focusAlt: `0 0 0 2px ${colors.signalBlueElement}`,
  },
  sidebarWidth: {
    expanded: '300px',
    collapsed: '10px',
  },
  footerHeight: '60px',
} as const

export const getColor = (color: UIColorKeys) => {
  return theme.colors[color]
}
