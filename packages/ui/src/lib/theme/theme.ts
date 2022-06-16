import { colorsV3, fonts as hedvigFonts } from '@hedviginsurance/brand'

const colors: Record<string, string> = {
  ...colorsV3,
}
colors.dark = colors.gray900
colors.light = colors.gray100
colors.lavender = colors.purple500

const fonts: Record<string, string> = {
  standard: `'${hedvigFonts.HEDVIG_LETTERS_STANDARD}', sans-serif`,
  small: `'${hedvigFonts.HEDVIG_LETTERS_SMALL}', serif`,
  big: `'${hedvigFonts.HEDVIG_LETTERS_BIG}', serif`,
}
fonts.body = fonts.standard
fonts.heading = fonts.standard

const fontSizes = [
  '0.75rem',
  '0.875rem',
  '1rem',
  '1.125rem',
  '1.25rem',
  '1.5rem',
  '2rem',
  '2.5rem',
  '3rem',
  '3.5rem',
  '4.5rem',
  '6rem',
]

const space = [
  0,
  '0.25rem',
  '0.5rem',
  '0.75rem',
  '1rem',
  '1.5rem',
  '2rem',
  '3rem',
  '4rem',
  '6rem',
  '8rem',
]

export const theme = {
  colors,
  fonts,
  fontSizes,
  space,
}

type CustomTheme = typeof theme

// Need to define Theme interface, since default is empty
// https://emotion.sh/docs/typescript
declare module '@emotion/react' {
  export interface Theme extends CustomTheme {}
}

export const getColor = (color?: string) => {
  return theme.colors[color as keyof typeof theme.colors] || 'currentColor'
}
