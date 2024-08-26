/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/consistent-type-definitions */

import '@emotion/react'

import type { theme } from 'ui'

declare module '@emotion/react' {
  type HedvigTheme = typeof theme

  export interface Theme extends HedvigTheme {}
}
