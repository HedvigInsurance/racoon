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

export const Default = Template.bind({})
Default.args = {
  name: `${HEDVIG_LOGO_SYMBOL} Home`,
  loading: false,
}

export const Loading = Template.bind({})
Loading.args = {
  name: `${HEDVIG_LOGO_SYMBOL} Home`,
  loading: true,
}
