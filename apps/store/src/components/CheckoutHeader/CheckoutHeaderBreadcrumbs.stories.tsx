import type { Meta, StoryObj } from '@storybook/react'
import { Breadcrumbs, CheckoutStep } from './Breadcrumbs'

const meta: Meta<typeof Breadcrumbs> = {
  title: 'Checkout / Header Breadcumbs',
  component: Breadcrumbs,
  argTypes: {
    steps: {
      table: { disable: true },
    },
  },
  parameters: { grid: { width: '1/3' } },
}

export default meta
type Story = StoryObj<typeof Breadcrumbs>

const Template: Story = {
  render: (args) => <Breadcrumbs {...args} />,
}

export const Default = {
  ...Template,
  args: {
    steps: [CheckoutStep.Checkout, CheckoutStep.Payment, CheckoutStep.Done],
    activeStep: CheckoutStep.Payment,
  },
}
