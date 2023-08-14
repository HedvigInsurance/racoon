import { RouterContext } from 'next/dist/shared/lib/router-context'
import { MockedProvider } from '@apollo/client/testing'
import './i18next'
import { Preview } from '@storybook/react'
import { gridDecorator, themeDecorator } from './decorators'

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
  design: {
    allowFullscreen: true,
  },
}

const preview: Preview = {
  decorators: [themeDecorator, gridDecorator],
}

export default preview
