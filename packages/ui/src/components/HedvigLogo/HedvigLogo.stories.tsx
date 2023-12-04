import { Meta, StoryFn } from '@storybook/react'
import { theme } from '../..'
import { HedvigLogo } from './HedvigLogo'

export default {
  title: 'Hedvig Logo',
  component: HedvigLogo,
} as Meta<typeof HedvigLogo>

const Template: StoryFn<typeof HedvigLogo> = (args) => <HedvigLogo {...args} />

export const Dark = Template.bind({})
Dark.args = {
  width: 94,
}

export const Light = Template.bind({})
Light.args = {
  width: 94,
  color: theme.colors.light,
}

Light.parameters = {
  backgrounds: { default: 'Dark' },
}
