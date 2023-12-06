import { Meta, StoryFn } from '@storybook/react'
import { theme } from '../..'
import { HedvigSymbol } from './HedvigSymbol'

export default {
  title: 'Logotypes / Hedvig Symbol',
  component: HedvigSymbol,
} as Meta<typeof HedvigSymbol>

const Template: StoryFn<typeof HedvigSymbol> = (args) => <HedvigSymbol {...args} />

export const Dark = Template.bind({})
Dark.args = {}

export const Light = Template.bind({})
Light.args = {
  color: theme.colors.light,
}

Light.parameters = {
  backgrounds: { default: 'Dark' },
}
