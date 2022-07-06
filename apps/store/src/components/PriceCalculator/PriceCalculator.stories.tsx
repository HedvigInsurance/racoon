import { ComponentMeta, Story } from '@storybook/react'
import { SE_APARTMENT_TEMPLATE } from '@/services/formTemplate/data/SE_APARTMENT'
import { PriceCalculator, PriceCalculatorProps } from './PriceCalculator'

export default {
  title: 'Price Calculator',
  component: PriceCalculator,
  argTypes: {
    onSubmit: { action: 'onSubmit' },
  },
} as ComponentMeta<typeof PriceCalculator>

const Template: Story<PriceCalculatorProps> = (props: PriceCalculatorProps) => {
  return <PriceCalculator {...props} />
}

export const Default = Template.bind({})
Default.args = {
  form: SE_APARTMENT_TEMPLATE,
}
