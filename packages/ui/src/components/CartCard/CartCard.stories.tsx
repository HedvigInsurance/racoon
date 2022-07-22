import { ComponentMeta, ComponentStory } from '@storybook/react'
import { CartCard } from './CartCard'
import { SelectableCardGroup } from '../Card/SelectableCardGroup'
import { Space } from '../Space'
import { useState } from 'react'

export default {
  title: 'UI / Card / Cart Card',
  component: CartCard,
  args: {},
} as ComponentMeta<typeof CartCard>

const Template: ComponentStory<typeof CartCard> = (args) => {
  return <CartCard {...args}></CartCard>
}

export const Default = Template.bind({})
Default.args = {
  price: '149 kr/mo.',
  title: 'Hedvig Home',
}
