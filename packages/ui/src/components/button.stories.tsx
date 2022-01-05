import { ComponentMeta, ComponentStory } from '@storybook/react'

import { Button } from './button'

export default {
  title: 'Button',
  component: Button,
  argTypes: {
    backgroundColor: { control: 'color' },
    disabled: { control: 'boolean' },
  },
} as ComponentMeta<typeof Button>

const Template: ComponentStory<typeof Button> = (args) => <Button {...args}>Hello</Button>

export const Secondary = Template.bind({})
Secondary.args = {}

export const SecondaryDisabled = Template.bind({})
SecondaryDisabled.args = {
  disabled: true,
}
