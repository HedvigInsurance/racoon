import { CSSObject } from '@emotion/react'
import { mq, Level } from '../../lib/media-query'
import { theme } from '../../lib/theme/theme'

type StandardHeadingSize = '18' | '20' | '24' | '32' | '40' | '48' | '56' | '72' | '96'
type SerifHeadingSize = Exclude<StandardHeadingSize, '18'>
export type PossibleHeadingVariant = `standard.${StandardHeadingSize}` | `serif.${SerifHeadingSize}`

const headings: Record<PossibleHeadingVariant, CSSObject> = {
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
}

export type HeadingVariant =
  | PossibleHeadingVariant
  | Partial<Record<Level | '_', PossibleHeadingVariant>>

export const getHeadingVariantStyles = (variant: HeadingVariant) => {
  if (typeof variant !== 'object') {
    return headings[variant]
  }

  let styles: CSSObject = {}
  const breakpoints = Object.keys(variant) as Array<keyof typeof variant>
  breakpoints.forEach((breakpoint) => {
    const variantAtBreakpoint = variant[breakpoint]

    if (!variantAtBreakpoint) {
      return
    }

    if (breakpoint === '_') {
      // Default breakpoint
      styles = { ...styles, ...headings[variantAtBreakpoint] }
    } else {
      styles = {
        ...styles,
        [mq[breakpoint as Level]]: {
          ...headings[variantAtBreakpoint],
        },
      }
    }
  })

  return styles
}
