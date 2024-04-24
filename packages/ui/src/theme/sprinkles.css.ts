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
    margin: theme.space,
    marginTop: theme.space,
    marginBottom: theme.space,
    marginLeft: theme.space,
    marginRight: theme.space,
    padding: theme.space,
    paddingTop: theme.space,
    paddingBottom: theme.space,
    paddingLeft: theme.space,
    paddingRight: theme.space,
  },
  shorthands: {
    mx: ['marginLeft', 'marginRight'],
    my: ['marginTop', 'marginBottom'],
    ml: ['marginLeft'],
    mr: ['marginRight'],
    mt: ['marginTop'],
    mb: ['marginBottom'],
    m: ['margin'],
    px: ['paddingLeft', 'paddingRight'],
    py: ['paddingTop', 'paddingBottom'],
    pl: ['paddingLeft'],
    pr: ['paddingRight'],
    pt: ['paddingTop'],
    pb: ['paddingBottom'],
    p: ['padding'],
  },
})

export const sprinkles = createSprinkles(unresponsiveProperties, responsiveProperties)
export type Sprinkles = Parameters<typeof sprinkles>[0]
