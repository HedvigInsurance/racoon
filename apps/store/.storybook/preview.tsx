import { MockedProvider } from '@apollo/client/testing'
import './i18next'
import { Preview } from '@storybook/react'
import { appProvidersDecorator, gridDecorator, themeDecorator, tokensDecorator } from './decorators'
import { theme } from 'ui'
import globalCss from 'ui/src/global.css'

// GOTCHA: Here we need to trick compiler into thinking we need global.css import
// for anything other than side effects
// Would've been easier if we just imported module without using it, but this leads to
// styles never appearing in resulting HTML. I guess tree shaking or similar optimization
// is the reason
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const noop = (val: any) => {}
noop(globalCss)

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
  decorators: [themeDecorator, tokensDecorator, gridDecorator, appProvidersDecorator],
}

export default preview
