import { ComponentMeta, Story } from '@storybook/react'
import { PriceCalculator, PriceCalculatorProps } from './PriceCalculator'
import { SWEDEN_APARTMENT_FORM } from './PriceCalculator.constants'

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
  form: SWEDEN_APARTMENT_FORM,
}
