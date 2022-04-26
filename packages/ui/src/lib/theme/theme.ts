import { colorsV3, fonts } from '@hedviginsurance/brand'

export const theme = {
  fonts: {
    body: `'${fonts.HEDVIG_LETTERS_STANDARD}', sans-serif`,
    heading: `'${fonts.HEDVIG_LETTERS_STANDARD}', sans-serif`,
  },
  colors: {
    ...colorsV3,
    dark: `${colorsV3.gray900}`,
    light: `${colorsV3.gray100}`,
    lavender: `${colorsV3.purple500}`,
  },
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
