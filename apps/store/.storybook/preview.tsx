import { RouterContext } from 'next/dist/shared/lib/router-context'
import { MockedProvider } from '@apollo/client/testing'
import './i18next'
import { Preview } from '@storybook/react'
import { gridDecorator, themeDecorator } from './decorators'
import { theme } from 'ui'

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
  backgrounds: {
    default: 'Light',
    values: [
      { name: 'Dark', value: theme.colors.dark },
      { name: 'Light', value: theme.colors.light },
    ],
  },
}

const preview: Preview = {
  decorators: [themeDecorator, gridDecorator],
}

export default preview
