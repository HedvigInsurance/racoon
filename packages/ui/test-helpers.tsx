import { ThemeProvider } from '@emotion/react'
import { render } from '@testing-library/react'
import { ReactElement, ReactNode } from 'react'

type WrappingThemeProviderProps = {
  children: ReactNode
}

const mockedTheme = {
  fonts: {},
  colors: {},
}

export const renderWithTheme = (component: ReactElement, theme: any = mockedTheme) => {
  const WrappingThemeProvider = ({ children }: WrappingThemeProviderProps) => (
    <ThemeProvider theme={theme}>{children}</ThemeProvider>
  )
  return render(component, { wrapper: WrappingThemeProvider })
}
