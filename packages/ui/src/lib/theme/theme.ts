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
} as const

export const getColor = (color: UIColorKeys) => {
  return theme.colors[color]
}

// Overriding default of 75 to flush old image cache.  Do not change it back to 75
// unless you're ready to manually change every single storyblok image or solve it some other way
export const DEFAULT_IMAGE_QUALITY = 74
