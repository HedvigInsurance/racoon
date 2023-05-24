import { Meta, StoryFn } from '@storybook/react'
import { Breadcrumbs, BreadcrumbsProps, CheckoutStep } from './Breadcrumbs'

export default {
  title: 'Checkout / Header Breadcumbs',
  component: Breadcrumbs,
  argTypes: {
    steps: {
      table: { disable: true },
    },
  },
} as Meta<typeof Breadcrumbs>

const Template: StoryFn<BreadcrumbsProps> = (props) => {
  return <Breadcrumbs {...props} />
}

export const Default = Template.bind({})
Default.args = {
  steps: [CheckoutStep.Checkout, CheckoutStep.Payment, CheckoutStep.Done],
  activeStep: CheckoutStep.Payment,
}
