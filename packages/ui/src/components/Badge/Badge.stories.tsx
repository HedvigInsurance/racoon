import { Meta, StoryFn } from '@storybook/react'
import { Badge } from './Badge'

export default {
  title: 'Badge',
  component: Badge,
} as Meta<typeof Badge>

const Template: StoryFn<typeof Badge> = (args) => <Badge {...args} />

export const Default = Template.bind({})
Default.args = { children: 'Badge' }
