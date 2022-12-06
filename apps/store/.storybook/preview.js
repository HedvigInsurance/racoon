import { ThemeProvider } from 'ui'
import { storybookFontStyles } from 'ui/src/lib/storybookFontStyles'
import { Global } from '@emotion/react'
import './i18next'

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

export const decorators = [
  (Story) => (
    <>
      <Global styles={storybookFontStyles} />
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    </>
  ),
]
