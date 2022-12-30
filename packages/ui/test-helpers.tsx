import { render, RenderResult } from '@testing-library/react'
import { ReactElement, ReactNode } from 'react'
import { ThemeProvider } from './src'

type WrappingThemeProviderProps = {
  children: ReactNode
}

const mockedTheme = {
  fonts: {},
  colors: {},
}

export const renderWithTheme = (
  component: ReactElement,
  theme: any = mockedTheme,
): RenderResult => {
  const WrappingThemeProvider = ({ children }: WrappingThemeProviderProps) => (
    <ThemeProvider theme={theme}>{children}</ThemeProvider>
  )
  return render(component, { wrapper: WrappingThemeProvider })
}
