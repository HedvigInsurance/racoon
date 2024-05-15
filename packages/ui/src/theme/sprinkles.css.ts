import { defineProperties, createSprinkles } from '@vanilla-extract/sprinkles'
import { mediaQueries } from './media'
import { themeVars } from './theme'
import { fontSizes } from './typography'

const textColors = {
  textPrimary: themeVars.colors.textPrimary,
  textSecondary: themeVars.colors.textSecondary,
  textSecondaryOnGray: themeVars.colors.textSecondaryOnGray,
  textTertiary: themeVars.colors.textTertiary,
  textTranslucentPrimary: themeVars.colors.textTranslucentPrimary,
  textTranslucentSecondary: themeVars.colors.textTranslucentSecondary,
  textTranslucentTertiary: themeVars.colors.textTranslucentTertiary,
  textDisabled: themeVars.colors.textDisabled,
  textNegative: themeVars.colors.textNegative,
  textGreen: themeVars.colors.textGreen,
  textAmber: themeVars.colors.textAmber,
  textRed: themeVars.colors.textRed,
  signalBlueText: themeVars.colors.signalBlueText,
  signalRedText: themeVars.colors.signalRedText,
  signalGreenText: themeVars.colors.signalGreenText,
  signalAmberText: themeVars.colors.signalAmberText,
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
    margin: themeVars.space,
    marginTop: themeVars.space,
    marginBottom: themeVars.space,
    marginLeft: themeVars.space,
    marginRight: themeVars.space,
    padding: themeVars.space,
    paddingTop: themeVars.space,
    paddingBottom: themeVars.space,
    paddingLeft: themeVars.space,
    paddingRight: themeVars.space,
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
