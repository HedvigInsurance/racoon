import { ComponentMeta, Story } from '@storybook/react'
import { PriceCardForm, PriceCardFormProps } from './PriceCardForm'
import { HEDVIG_LOGO_SYMBOL } from './PriceCardForm.constants'

export default {
  title: 'Price Card Form',
  component: PriceCardForm,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    onClick: { action: 'clicked' },
  },
} as ComponentMeta<typeof PriceCardForm>

const Template: Story<PriceCardFormProps> = (props) => {
  return <PriceCardForm {...props} />
}

export const Disabled = Template.bind({})
Disabled.args = {
  name: `${HEDVIG_LOGO_SYMBOL} Home`,
  gradient: ['#aaaaaa', '#828282'],
  currencyCode: 'SEK',
  loading: false,
}

export const ShowingPrice = Template.bind({})
ShowingPrice.args = {
  name: `${HEDVIG_LOGO_SYMBOL} Home`,
  cost: 112,
  currencyCode: 'SEK',
  gradient: ['#aaaaaa', '#828282'],
  loading: false,
}
