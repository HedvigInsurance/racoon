import { legacyTheme, theme as defaultTheme, ThemeProvider } from '../src'
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
      { name: 'Dark', value: defaultTheme.colors.dark },
      { name: 'Light', value: defaultTheme.colors.light },
    ],
  },
  layout: 'centered',
}

export const withTheme = (Story, context) => {
  // Get values from story parameter first
  const theme = context.parameters.theme || context.globals.theme
  const storyTheme = theme === 'legacy' ? legacyTheme : defaultTheme
  return (
    <>
      <Global styles={storybookFontStyles} />
      <ThemeProvider theme={storyTheme}>
        <Story />
      </ThemeProvider>
    </>
  )
}

export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Global theme for components',
    defaultValue: 'default',
    toolbar: {
      // The icon for the toolbar item
      icon: 'circlehollow',
      // Array of options
      items: [
        { value: 'default', icon: 'circlehollow', title: 'Default theme' },
        { value: 'legacy', icon: 'circle', title: 'Legacy theme' },
      ],
      // Property that specifies if the name of the item will be displayed
      showName: true,
    },
  },
}

export const decorators = [withTheme]
