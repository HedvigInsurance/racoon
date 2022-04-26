import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Space } from '../Space'
import { QuotePriceCard } from './QuotePriceCard'

export default {
  title: 'UI / Card / QuotePriceCard',
  component: QuotePriceCard,
  args: {},
} as ComponentMeta<typeof QuotePriceCard>

const Template: ComponentStory<typeof QuotePriceCard> = (args) => {
  return <QuotePriceCard {...args}></QuotePriceCard>
}

export const Default = Template.bind({})
Default.args = {
  size: 'md',
  price: '798 SEK/month',
  title: (
    <>
      Home insurance &<br /> Accident insurance
    </>
  ),
}
