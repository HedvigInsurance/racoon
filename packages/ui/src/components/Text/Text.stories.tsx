import type { Meta, StoryObj } from '@storybook/react'
import { Text } from './Text'

const meta: Meta<typeof Text> = {
  title: 'Text',
  component: Text,
  parameters: {
    backgrounds: {
      default: 'Light',
    },
  },
  args: {
    children: 'This is a Text',
  },
}

export default meta
type Story = StoryObj<typeof Text>

export const SingleSize: Story = {
  args: { color: 'textPrimary', size: 'lg' },
}

export const ResponsiveSize: Story = {
  args: { color: 'textPrimary', size: { _: 'sm', md: 'lg', lg: 'xxl' } },
}
