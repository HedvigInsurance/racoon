import { theme, ThemeProvider } from '../src'
import { Global } from '@emotion/react'
import { storybookFontStyles } from '../src/lib/storybookFontStyles'

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  backgrounds: {
    default: 'Light',
    values: [
      { name: 'Dark', value: theme.colors.gray900 },
      { name: 'Light', value: theme.colors.gray100 },
    ],
  },
  layout: 'centered',
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