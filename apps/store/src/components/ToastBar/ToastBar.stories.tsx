import type { Meta, StoryObj } from '@storybook/react'
import { Space } from 'ui'
import { InfoToastBar, AttentionToastBar, ErrorToastBar } from './ToastBar'

const meta: Meta<typeof InfoToastBar> = {
  title: 'Components / Toast Bar',
  component: InfoToastBar,
  parameters: { grid: { width: '1/3' } },
}

export default meta
type Story = StoryObj<typeof InfoToastBar>

export const Variants: Story = {
  args: {
    children: 'Info goes here',
  },

  render: (args) => (
    <Space y={1}>
      <InfoToastBar>{args.children}</InfoToastBar>

      <AttentionToastBar>{args.children}</AttentionToastBar>

      <ErrorToastBar>{args.children}</ErrorToastBar>
    </Space>
  ),
}
