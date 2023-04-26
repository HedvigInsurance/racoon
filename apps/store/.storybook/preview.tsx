import { ThemeProvider } from 'ui'
import { storybookFontStyles } from 'ui/src/lib/storybookFontStyles'
import { Global } from '@emotion/react'
import { RouterContext } from 'next/dist/shared/lib/router-context'
import { MockedProvider } from '@apollo/client/testing'
import './i18next'
import React from 'react'
import { type Decorator } from '@storybook/react'

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
    locale: 'se-en',
    path: '/se-en',
  },
}

export const decorators: Array<Decorator> = [
  (Story) => (
    <>
      <Global styles={storybookFontStyles} />
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    </>
  ),
]
