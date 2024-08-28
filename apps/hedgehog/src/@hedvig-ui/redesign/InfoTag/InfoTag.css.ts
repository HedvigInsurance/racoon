import { style, styleVariants } from '@vanilla-extract/css'
import { colors, theme } from '../theme'

export const base = style({
  paddingBlock: theme.space.xs,
  paddingInline: theme.space.sm,
  borderRadius: theme.space.xs,
  fontSize: theme.fontSizes.xs,
  height: 'max-content',
})

export const infoTagStyle = styleVariants({
  success: {
    backgroundColor: colors.signalGreenFill,
    color: colors.signalGreenText,
  },
  danger: {
    backgroundColor: colors.signalRedFill,
    color: colors.signalRedText,
  },
  warning: {
    backgroundColor: colors.signalAmberFill,
    color: colors.signalAmberText,
  },
  info: {
    backgroundColor: colors.signalBlueFill,
    color: colors.signalBlueText,
  },
  neutral: {
    backgroundColor: colors.buttonSecondary,
    color: colors.textSecondary,
  },
})
