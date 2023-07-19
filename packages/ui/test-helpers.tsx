import { type Theme } from '@emotion/react'
import { render, type RenderResult } from '@testing-library/react'
import { type ReactElement, type ReactNode } from 'react'
import { ThemeProvider } from './src'

type WrappingThemeProviderProps = {
  children: ReactNode
}

const mockedTheme = {
  fonts: {},
  colors: {},
  shadow: {},
} as Theme

export const renderWithTheme = (
  component: ReactElement,
  theme: Theme = mockedTheme,
): RenderResult => {
  const WrappingThemeProvider = ({ children }: WrappingThemeProviderProps) => (
    <ThemeProvider theme={theme}>{children}</ThemeProvider>
  )
  return render(component, { wrapper: WrappingThemeProvider })
}
