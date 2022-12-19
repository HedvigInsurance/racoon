import '@emotion/react'
import { theme } from './lib/theme/theme'

declare module '@emotion/react' {
  type HedvigTheme = typeof theme

  export interface Theme extends HedvigTheme {}
}
