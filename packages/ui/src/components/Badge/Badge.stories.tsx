import type { Meta, StoryObj } from '@storybook/react'
import { Space } from '../Space'
import { Badge } from './Badge'

const meta: Meta<typeof Badge> = {
  title: 'Badge',
  component: Badge,
  parameters: {
    design: {
      allowFullscreen: true,
      type: 'figma',
      url: 'https://www.figma.com/file/qUhLjrKl98PAzHov9ilaDH/Hedvig-UI-Kit?type=design&node-id=3208-13289&mode=design&t=vZvysCYZ1EU8kxI4-4',
    },
  },
}
export default meta

type Story = StoryObj<typeof Badge>

export const Default: Story = {
  render: (args) => (
    <Space x={1}>
      <Badge size="big" {...args} />
      <Badge size="small" {...args} />
      <Badge size="responsive" {...args} />
    </Space>
  ),
}
Default.args = { children: 'Badge' }
