import '@emotion/react'
import { theme } from './lib/theme/theme'

declare module '@emotion/react' {
  type MyTheme = typeof theme

  export interface Theme extends MyTheme {}
}
