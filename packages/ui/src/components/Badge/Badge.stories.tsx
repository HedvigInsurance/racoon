import { Meta, StoryFn } from '@storybook/react'
import { Space } from '../Space'
import { Badge } from './Badge'

export default {
  title: 'Badge',
  component: Badge,
} as Meta<typeof Badge>

const Template: StoryFn<typeof Badge> = (args) => (
  <Space x={1}>
    <Badge size="small" {...args} />
    <Badge size="big" {...args} />
  </Space>
)

export const Default = Template.bind({})
Default.args = { children: 'Badge' }
