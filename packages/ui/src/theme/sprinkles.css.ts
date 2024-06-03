import { defineProperties, createSprinkles } from '@vanilla-extract/sprinkles'
import { tokens } from '../theme'
import { mediaQueries } from './media'
import { fontSizes } from './typography'

const textColors = {
  textPrimary: tokens.colors.textPrimary,
  textSecondary: tokens.colors.textSecondary,
  textSecondaryOnGray: tokens.colors.textSecondaryOnGray,
  textTertiary: tokens.colors.textTertiary,
  textTranslucentPrimary: tokens.colors.textTranslucentPrimary,
  textTranslucentSecondary: tokens.colors.textTranslucentSecondary,
  textTranslucentTertiary: tokens.colors.textTranslucentTertiary,
  textDisabled: tokens.colors.textDisabled,
  textNegative: tokens.colors.textNegative,
  textGreen: tokens.colors.textGreen,
  textAmber: tokens.colors.textAmber,
  textRed: tokens.colors.textRed,
  signalBlueText: tokens.colors.signalBlueText,
  signalRedText: tokens.colors.signalRedText,
  signalGreenText: tokens.colors.signalGreenText,
  signalAmberText: tokens.colors.signalAmberText,
} as const

const unresponsiveProperties = defineProperties({
  properties: {
    alignItems: ['flex-start', 'center', 'flex-end'],
    textAlign: ['left', 'center', 'right'],
    color: textColors,
    display: ['flex', 'grid'],
    flexDirection: ['row', 'column'],
    flexGrow: [1],
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
    margin: tokens.space,
    marginTop: tokens.space,
    marginBottom: tokens.space,
    marginLeft: tokens.space,
    marginRight: tokens.space,
    padding: tokens.space,
    paddingTop: tokens.space,
    paddingBottom: tokens.space,
    paddingLeft: tokens.space,
    paddingRight: tokens.space,
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
