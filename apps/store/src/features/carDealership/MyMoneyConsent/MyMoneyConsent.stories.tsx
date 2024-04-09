import type { Meta, StoryObj } from '@storybook/react'
import { MyMoneyConsent } from './MyMoneyConsent'

const meta: Meta<typeof MyMoneyConsent> = {
  component: MyMoneyConsent,
  parameters: {
    grid: { width: '1/3' },
  },
}

export default meta
type Story = StoryObj<typeof MyMoneyConsent>

export const Default: Story = {}
