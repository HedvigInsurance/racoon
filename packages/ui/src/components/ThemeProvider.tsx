import { Global, Theme, ThemeProvider as EmotionThemeProvider } from '@emotion/react'
import { ReactNode } from 'react'
import { globalStyles, theme as hedvigTheme } from '../theme'

type ThemeProviderProps = {
  children: ReactNode
  theme?: Theme
  hedvigFonts?: Record<string, any>
}

export const ThemeProvider = ({ children, theme = hedvigTheme }: ThemeProviderProps) => {
  return (
    <>
      <Global styles={globalStyles} />
      <EmotionThemeProvider theme={theme}>{children}</EmotionThemeProvider>
    </>
  )
}
