import { style } from '@vanilla-extract/css'
import { defineProperties, createSprinkles } from '@vanilla-extract/sprinkles'
import { breakpoints, fontSizes, theme } from '../../theme'

const textColor = {
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

export const textBase = style({
  whiteSpace: 'pre-wrap',
  color: 'inherit',
})

export const textStrikethrough = style({
  textDecorationLine: 'line-through',
})

export const textUppercase = style({
  textTransform: 'uppercase',
})

const textProperties = defineProperties({
  properties: {
    textAlign: ['left', 'center', 'right'],
    color: textColor,
  },
})

const mediaQueries = Object.fromEntries(
  Object.entries(breakpoints).map(([name, width]) => {
    return [name, { '@media': `screen and (min-width: ${width}px)` }]
  }),
)

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

export const textSprinkles = createSprinkles(textProperties, responsiveProperties)

export type TextSprinkles = Parameters<typeof textSprinkles>[0]
