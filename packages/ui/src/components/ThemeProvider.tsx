import type { Theme } from '@emotion/react'
import { ThemeProvider as EmotionThemeProvider } from '@emotion/react'
import type { ReactNode } from 'react'
import { theme as hedvigTheme } from '../theme'

type ThemeProviderProps = {
  children: ReactNode
  theme?: Theme
  hedvigFonts?: Record<string, any>
}

export const ThemeProvider = ({ children, theme = hedvigTheme }: ThemeProviderProps) => {
  return (
    <>
      <EmotionThemeProvider theme={theme}>{children}</EmotionThemeProvider>
    </>
  )
}
