import { theme } from '../../theme'
import { responsiveVariants } from '../../utils/responsiveVariants/responsiveVariants'

export const responsiveVariantStyles = responsiveVariants({
  base: {
    fontFamily: theme.fonts.heading,
    fontWeight: 400,
    lineHeight: 1.2,
    whiteSpace: 'pre-wrap',
  },
  variants: {
    'standard.18': {
      fontSize: theme.fontSizes[3],
      lineHeight: 1.32,
    },
    'standard.20': {
      fontSize: theme.fontSizes[4],
      lineHeight: 1.32,
    },
    'standard.24': {
      fontSize: theme.fontSizes[5],
      lineHeight: 1.26,
    },
    'standard.32': {
      fontSize: theme.fontSizes[6],
      letterSpacing: '-0.01em',
      lineHeight: 1.26,
    },
    'standard.40': {
      fontSize: theme.fontSizes[7],
      letterSpacing: '-0.01em',
      lineHeight: 1.26,
    },
    'standard.48': {
      fontSize: theme.fontSizes[8],
      letterSpacing: '-0.01em',
      lineHeight: 1.26,
    },
    'standard.56': {
      fontSize: theme.fontSizes[9],
      letterSpacing: '-0.02em',
      lineHeight: 1.26,
    },
    'standard.72': {
      fontSize: theme.fontSizes[10],
      letterSpacing: '-0.02em',
      lineHeight: 1.12,
    },
    'standard.96': {
      fontSize: theme.fontSizes[11],
      letterSpacing: '-0.02em',
      lineHeight: 1.12,
    },
    'serif.20': {
      fontSize: theme.fontSizes[4],
      fontFamily: theme.fonts.small,
      lineHeight: 1.32,
    },
    'serif.24': {
      fontSize: theme.fontSizes[5],
      fontFamily: theme.fonts.small,
      lineHeight: 1.26,
    },
    'serif.32': {
      fontSize: theme.fontSizes[6],
      fontFamily: theme.fonts.big,
      lineHeight: 1.26,
    },
    'serif.40': {
      fontSize: theme.fontSizes[7],
      fontFamily: theme.fonts.big,
      lineHeight: 1.26,
    },
    'serif.48': {
      fontSize: theme.fontSizes[8],
      letterSpacing: '-0.01em',
      fontFamily: theme.fonts.big,
      lineHeight: 1.26,
    },
    'serif.56': {
      fontSize: theme.fontSizes[9],
      fontFamily: theme.fonts.big,
      lineHeight: 1.26,
    },
    'serif.72': {
      fontSize: theme.fontSizes[10],
      fontFamily: theme.fonts.big,
      lineHeight: 1.12,
    },
    'serif.96': {
      fontSize: theme.fontSizes[11],
      fontFamily: theme.fonts.big,
      lineHeight: 1.12,
    },
  },
})
