import { ComponentMeta, ComponentStory } from '@storybook/react'
import { CartCard } from './CartCard'

export default {
  title: ' Cart Card',
  component: CartCard,
  args: {},
} as ComponentMeta<typeof CartCard>

const Template: ComponentStory<typeof CartCard> = (args) => {
  return <CartCard {...args}></CartCard>
}

export const Default = Template.bind({})
Default.args = {
  price: 149,
  title: 'Hedvig Home',
  currency: 'SEK',
}
