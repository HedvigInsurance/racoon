import { ThemeProvider, Global } from '@emotion/react'
import { theme, globalStyles } from 'ui'

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
      <Global styles={globalStyles} />
      <ThemeProvider theme={theme}>
        <Story />
      </ThemeProvider>
    </>
  ),
]
