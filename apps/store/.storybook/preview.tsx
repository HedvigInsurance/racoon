import { ThemeProvider } from 'ui'
import { storybookFontStyles } from 'ui/src/lib/storybookFontStyles'
import { Global } from '@emotion/react'
import { RouterContext } from 'next/dist/shared/lib/router-context'
import { MockedProvider } from '@apollo/client/testing'
import './i18next'

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  apolloClient: {
    MockedProvider,
  },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  nextRouter: {
    Provider: RouterContext.Provider,
    locale: 'en-se',
    path: '/en-se',
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
