import { type Meta, type StoryObj } from '@storybook/react'
import { DiscountField } from './DiscountField'

const meta: Meta<typeof DiscountField> = {
  title: 'Components / Shop Breakdown / Discount Field',
  component: DiscountField,
  argTypes: {
    onAdd: { action: 'onAdd', table: { disable: true } },
    onRemove: { action: 'onRemove', table: { disable: true } },
  },
}

export default meta
type Story = StoryObj<typeof DiscountField>

export const Inactive: Story = {
  args: {},
}

export const Active: Story = {
  args: {
    defaultActive: true,
  },
}

export const ActiveLoading: Story = {
  args: {
    ...Active.args,
    loadingAdd: true,
  },
}

export const ActiveError: Story = {
  args: {
    ...Active.args,
    errorMessage: 'Invalid code',
  },
}

export const ActiveAdded: Story = {
  args: {
    ...Active.args,
    discount: {
      code: 'SUMMER',
      explanation: '3 months for free',
    },
  },
}

export const ActiveAddedLoading: Story = {
  args: {
    ...ActiveAdded.args,
    loadingRemove: true,
  },
}
