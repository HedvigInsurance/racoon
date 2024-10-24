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
    card: `0px 2px 2px -1px ${colors.borderTranslucent2}, 0px 4px 10px -2px ${colors.translucent1}`,
    default: '0 1px 2px 0 rgb(0 0 0 / 15%)',
    focus: `0 0 0 2px ${colors.textPrimary}`,
    focusAlt: `0 0 0 2px ${colors.signalBlueElement}`,
  },
  width: {
    layoutMax: '90rem',
  },
  components: {
    input: {
      background: {
        default: colors.translucent1,
        selected: colors.backgroundStandard,
      },
    },
    table: {
      cell: {
        background: {
          default: 'inherit',
          // TODO: change this to theme.colors.signalGreenFill when we update UI kit colors
          active: 'hsl(95, 74%, 85%)',
        },
      },
    },
  },
} as const

export const getColor = (color: UIColorKeys) => {
  return theme.colors[color]
}
