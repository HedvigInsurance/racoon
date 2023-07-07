import { Meta, StoryObj } from '@storybook/react'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import { Breadcrumbs, CheckoutStep } from './Breadcrumbs'

const meta: Meta<typeof Breadcrumbs> = {
  title: 'Checkout / Header Breadcumbs',
  component: Breadcrumbs,
  argTypes: {
    steps: {
      table: { disable: true },
    },
  },
}

export default meta
type Story = StoryObj<typeof Breadcrumbs>

const Template: Story = {
  render: (args) => (
    <GridLayout.Root>
      <GridLayout.Content width="1/3" align="center">
        <Breadcrumbs {...args} />
      </GridLayout.Content>
    </GridLayout.Root>
  ),
}

export const Default = {
  ...Template,
  args: {
    steps: [CheckoutStep.Checkout, CheckoutStep.Payment, CheckoutStep.Done],
    activeStep: CheckoutStep.Payment,
  },
}
