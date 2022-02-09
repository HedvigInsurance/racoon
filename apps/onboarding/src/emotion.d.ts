import '@emotion/react'
import { theme } from 'ui'

declare module '@emotion/react' {
  type MyTheme = typeof theme

  export interface Theme extends MyTheme {}
}
