import type { Meta, StoryObj } from '@storybook/react'
import { Space } from 'ui'
import { AttentionCard, ErrorCard, InfoCard } from './InfoCard'

const meta: Meta<typeof InfoCard> = {
  title: 'Components / Info Card',
  component: InfoCard,
  parameters: { grid: { width: '1/3' } },
}

export default meta
type Story = StoryObj<typeof InfoCard>

export const Variants: Story = {
  args: {
    children:
      'A short message about something that needs attention, an error, info or a success message.',
  },

  render: (args) => (
    <Space y={1}>
      <InfoCard>{args.children}</InfoCard>

      <AttentionCard>{args.children}</AttentionCard>

      <ErrorCard>{args.children}</ErrorCard>
    </Space>
  ),
}
