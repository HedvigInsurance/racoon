import { ComponentMeta, Story } from '@storybook/react'
import { PriceCard, PriceCardProps } from './PriceCard'
import { HEDVIG_LOGO_SYMBOL } from './PriceCard.constants'

export default {
  title: 'Price Card',
  component: PriceCard,
  argTypes: {
    onClick: { action: 'clicked' },
  },
} as ComponentMeta<typeof PriceCard>

const Template: Story<PriceCardProps> = (props) => {
  return <PriceCard {...props} />
}

export const Disabled = Template.bind({})
Disabled.args = {
  name: `${HEDVIG_LOGO_SYMBOL} Home`,
  currency: 'SEK',
  gradient: ['#aaaaaa', '#828282'],
}

export const ShowingPrice = Template.bind({})
ShowingPrice.args = {
  name: `${HEDVIG_LOGO_SYMBOL} Home`,
  currency: 'SEK',
  cost: 112,
  gradient: ['#aaaaaa', '#828282'],
}
