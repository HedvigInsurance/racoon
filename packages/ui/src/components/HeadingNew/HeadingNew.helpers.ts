import { Theme } from '@emotion/react'

type HeadingSize = '18' | '20' | '24' | '32' | '40' | '48' | '56' | '72' | '96'

type HeadingStyles = {
  [key in HeadingSize]: object
}

type HeadingVariants = {
  standard: HeadingStyles
  serif: Omit<HeadingStyles, '18'>
}

export type HeadingVariant = `standard.${HeadingSize}` | `serif.${Exclude<HeadingSize, '18'>}`

export const getHeadingVariant = (variant: HeadingVariant, theme: Theme) => {
  const headings = {
    standard: {
      18: {
        fontSize: theme.fontSizes[3],
      },
      20: {
        fontSize: theme.fontSizes[4],
      },
      24: {
        fontSize: theme.fontSizes[5],
      },
      32: {
        fontSize: theme.fontSizes[6],
        letterSpacing: '-0.01em',
      },
      40: {
        fontSize: theme.fontSizes[7],
        letterSpacing: '-0.01em',
      },
      48: {
        fontSize: theme.fontSizes[8],
        letterSpacing: '-0.01em',
      },
      56: {
        fontSize: theme.fontSizes[9],
        letterSpacing: '-0.02em',
      },
      72: {
        fontSize: theme.fontSizes[10],
        letterSpacing: '-0.02em',
      },
      96: {
        fontSize: theme.fontSizes[11],
        letterSpacing: '-0.02em',
      },
    },
    serif: {
      18: {
        fontSize: theme.fontSizes[3],
        fontFamily: theme.fonts.small,
      },
      20: {
        fontSize: theme.fontSizes[4],
        fontFamily: theme.fonts.small,
      },
      24: {
        fontSize: theme.fontSizes[5],
        fontFamily: theme.fonts.small,
      },
      32: {
        fontSize: theme.fontSizes[6],
        letterSpacing: '-0.01em',
        fontFamily: theme.fonts.small,
      },
      40: {
        fontSize: theme.fontSizes[7],
        letterSpacing: '-0.01em',
        fontFamily: theme.fonts.small,
      },
      48: {
        fontSize: theme.fontSizes[8],
        letterSpacing: '-0.01em',
        fontFamily: theme.fonts.small,
      },
      56: {
        fontSize: theme.fontSizes[9],
        fontFamily: theme.fonts.big,
      },
      72: {
        fontSize: theme.fontSizes[10],
        fontFamily: theme.fonts.big,
      },
      96: {
        fontSize: theme.fontSizes[11],
        fontFamily: theme.fonts.big,
      },
    },
  }
  const variantProperties = variant.split('.')
  const flavour = variantProperties[0] as keyof HeadingVariants
  const size = variantProperties[1] as HeadingSize
  const headingVariant = headings[flavour][size]
  return headingVariant
}
