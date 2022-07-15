import { colorsV3 } from '@hedviginsurance/brand'
import { fonts, fontSizes } from './typography'

const colors: Record<string, string> = {
  ...colorsV3,
}
colors.dark = colors.gray900
colors.light = colors.gray100
colors.lavender = colors.purple500

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
