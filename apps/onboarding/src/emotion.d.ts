import '@emotion/react'
import { LegacyTheme } from 'ui'

declare module '@emotion/react' {
  export interface Theme extends LegacyTheme {}
}
