import { Global, Theme, ThemeProvider as EmotionThemeProvider } from '@emotion/react'
import { globalStyles } from '../globalStyles'
import { theme as hedvigTheme } from './theme'

type ThemeProviderProps = {
  children: React.ReactNode
  theme?: Theme
}

export const ThemeProvider = ({ children, theme = hedvigTheme }: ThemeProviderProps) => (
  <>
    <Global styles={globalStyles} />
    <EmotionThemeProvider theme={theme}>{children}</EmotionThemeProvider>
  </>
)
