import { type Decorator } from '@storybook/react'
import { Global } from '@emotion/react'
import { ThemeProvider } from 'ui'
import { storybookFontStyles } from 'ui/src/lib/storybookFontStyles'
import { GridLayout } from '../src/components/GridLayout/GridLayout'

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
  const width = options.parameters.grid
  if (!width) return <Story />
  return (
    <GridLayout.Root style={{ paddingInline: 0 }}>
      <GridLayout.Content width={width} align="center">
        <Story />
      </GridLayout.Content>
    </GridLayout.Root>
  )
}
