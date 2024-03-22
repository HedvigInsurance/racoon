import { type Decorator } from '@storybook/react'
import { Global } from '@emotion/react'
import { ApolloProvider } from '@apollo/client'
import { ThemeProvider } from 'ui'
import { storybookFontStyles } from 'ui/src/theme/storybookFontStyles'
import * as GridLayout from '../src/components/GridLayout/GridLayout'
import { initializeApollo } from '../src/services/apollo/client'
import { AppErrorProvider } from '../src/services/appErrors/AppErrorContext'

export const themeDecorator: Decorator = (Story) => (
  <>
    <Global styles={storybookFontStyles} />
    <ThemeProvider>
      <Story />
    </ThemeProvider>
  </>
)

/**
 * Decorator for defining grid layout as a parameter in a story.
 * Example:
 * parameters: {
 *   grid: '1/2' or { base: '1', md: '5/6', lg: '2/3', xl: '1/2' },
 * },
 */
export const gridDecorator: Decorator = (Story, options) => {
  if (!options.parameters.grid) return <Story />
  const width = options.parameters.grid.width
  const align = options.parameters.grid.align ?? 'left'

  return (
    <GridLayout.Root style={{ paddingInline: 0 }}>
      <GridLayout.Content width={width} align={align}>
        <Story />
      </GridLayout.Content>
    </GridLayout.Root>
  )
}

export const appProvidersDecorator: Decorator = (Story) => {
  const apolloClient = initializeApollo()
  return (
    <ApolloProvider client={apolloClient}>
      <AppErrorProvider>
        <Story />
      </AppErrorProvider>
    </ApolloProvider>
  )
}
