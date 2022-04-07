import { colorsV3, fonts } from '@hedviginsurance/brand'
import '@emotion/react'

export const theme = {
  fonts: {
    body: `'${fonts.FAVORIT}', sans-serif`,
    heading: `'${fonts.FAVORIT}', sans-serif`,
  },
  colors: {
    ...colorsV3,
    dark: `${colorsV3.gray900}`,
    light: `${colorsV3.gray100}`,
    lavender: `${colorsV3.purple500}`,
  },
}

// Need to define Theme interface, since default is empty
// https://emotion.sh/docs/typescript
declare module '@emotion/react' {
  export interface Theme {
    fonts: typeof theme.fonts
    colors: typeof theme.colors
  }
}

export const getColor = (color?: string) => {
  return theme.colors[color as keyof typeof theme.colors] || 'currentColor'
}
