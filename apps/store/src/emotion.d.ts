import '@emotion/react'
import { theme } from 'ui'

declare module '@emotion/react' {
  type HedvigTheme = typeof theme

  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  export interface Theme extends HedvigTheme {}
}
