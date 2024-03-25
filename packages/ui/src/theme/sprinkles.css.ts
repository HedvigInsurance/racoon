import { defineProperties, createSprinkles } from '@vanilla-extract/sprinkles'
import { mediaQueries } from './media'
import { theme } from './theme'
import { fontSizes } from './typography'

const textColors = {
  textPrimary: theme.colors.textPrimary,
  textSecondary: theme.colors.textSecondary,
  textSecondaryOnGray: theme.colors.textSecondaryOnGray,
  textTertiary: theme.colors.textTertiary,
  textTranslucentPrimary: theme.colors.textTranslucentPrimary,
  textTranslucentSecondary: theme.colors.textTranslucentSecondary,
  textTranslucentTertiary: theme.colors.textTranslucentTertiary,
  textDisabled: theme.colors.textDisabled,
  textNegative: theme.colors.textNegative,
  textGreen: theme.colors.textGreen,
  textAmber: theme.colors.textAmber,
  textRed: theme.colors.textRed,
  signalBlueText: theme.colors.signalBlueText,
  signalRedText: theme.colors.signalRedText,
  signalGreenText: theme.colors.signalGreenText,
  signalAmberText: theme.colors.signalAmberText,
} as const

const unresponsiveProperties = defineProperties({
  properties: {
    textAlign: ['left', 'center', 'right'],
    color: textColors,
  },
})

const responsiveProperties = defineProperties({
  conditions: {
    _: {},
    ...mediaQueries,
  },
  defaultCondition: '_',
  properties: {
    fontSize: fontSizes,
  },
})

export const sprinkles = createSprinkles(unresponsiveProperties, responsiveProperties)
export type Sprinkles = Parameters<typeof sprinkles>[0]
