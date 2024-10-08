import { createSprinkles, defineProperties } from '@vanilla-extract/sprinkles'
import { createSubset } from '../utils/createSubset'
import { mediaQueries } from './media'
import { tokens } from './theme.css'
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

const mediaQueriesSubset = createSubset(mediaQueries, ['sm', 'md', 'lg'])

const unresponsiveProperties = defineProperties({
  properties: {
    alignItems: ['flex-start', 'center', 'flex-end', 'stretch'],
    alignSelf: ['center'],
    justifyContent: ['center', 'space-between', 'flex-end'],
    textAlign: ['left', 'center', 'right'],
    color: textColors,
    display: ['flex', 'grid', 'none'],
    flexDirection: ['row', 'column'],
    flexGrow: [1],
    marginInline: tokens.space,
    marginTop: tokens.space,
    marginBottom: tokens.space,
    marginLeft: tokens.space,
    marginRight: tokens.space,
    overflow: ['hidden'],
    padding: tokens.space,
    paddingBlock: tokens.space,
    paddingInline: tokens.space,
    paddingTop: tokens.space,
    paddingBottom: tokens.space,
    paddingLeft: tokens.space,
    paddingRight: tokens.space,
    position: ['relative', 'absolute', 'fixed'],
  },
  shorthands: {
    mx: ['marginLeft', 'marginRight'],
    my: ['marginTop', 'marginBottom'],
    ml: ['marginLeft'],
    mr: ['marginRight'],
    mt: ['marginTop'],
    mb: ['marginBottom'],
    px: ['paddingLeft', 'paddingRight'],
    py: ['paddingTop', 'paddingBottom'],
    pl: ['paddingLeft'],
    pr: ['paddingRight'],
    pt: ['paddingTop'],
    pb: ['paddingBottom'],
  },
})

const responsiveProperties = defineProperties({
  conditions: {
    _: {},
    ...mediaQueriesSubset,
  },
  defaultCondition: '_',
  properties: {
    fontSize: fontSizes,
    gap: tokens.space,
  },
})

export const sprinkles = createSprinkles(unresponsiveProperties, responsiveProperties)
export type Sprinkles = Parameters<typeof sprinkles>[0]
