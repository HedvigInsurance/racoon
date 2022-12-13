import '@emotion/react'
import { legacyTheme } from 'ui'

declare module '@emotion/react' {
  type LegacyTheme = typeof legacyTheme

  export interface Theme extends LegacyTheme {}
}
