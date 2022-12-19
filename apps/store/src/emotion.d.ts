import '@emotion/react'
import { theme } from 'ui'

declare module '@emotion/react' {
  type HedvigTheme = typeof theme

  export interface Theme extends HedvigTheme {}
}
