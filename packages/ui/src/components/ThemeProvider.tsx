import { Global, Theme, ThemeProvider as EmotionThemeProvider } from '@emotion/react'
import { globalStyles } from '../theme/globalStyles'
import { theme as hedvigTheme } from '../theme/theme'

type ThemeProviderProps = {
  children: React.ReactNode
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
