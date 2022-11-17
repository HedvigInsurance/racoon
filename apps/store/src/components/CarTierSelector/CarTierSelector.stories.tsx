import { ComponentMeta, ComponentStory } from '@storybook/react'
import { useState } from 'react'
import * as Accordion from './CarTierSelector'

export default {
  title: 'CarTierSelector',
  component: Accordion.Root,
} as ComponentMeta<typeof Accordion.Root>

type MockedTierItemType = Array<Accordion.TierItemProps>

const MockedTierItems: MockedTierItemType = [
  {
    value: '0',
    title: 'Trafikförsäkring',
    description: 'Grundläggande skydd för att köra bil',
    isSelected: false,
    price: '300 kr/mån',
  },
  {
    value: '1',
    title: 'Halvförsäkring Tack',
    description: 'Grundläggande skydd för att köra bil',
    isSelected: false,
    price: '300 kr/mån',
    recommendedText: 'Rekommenderad för din bil',
  },
  {
    value: '2',
    title: 'Halvförsäkring',
    description: 'Grundläggande skydd för att köra bil',
    isSelected: false,
    price: '300 kr/mån',
  },
  {
    value: '3',
    title: 'Halvförsäkring plus',
    description: 'Grundläggande skydd för att köra bil',
    isSelected: false,
    price: '300 kr/mån',
  },
]

const Template: ComponentStory<typeof Accordion.Root> = () => {
  const [selected, setSelected] = useState('')

  const handleClick = (item: string) => {
    console.log('item', item)
    setSelected(item)
  }

  return (
    <Accordion.Root type="multiple">
      <Accordion.Item value="item-1">
        <Accordion.HeaderWithTrigger>Välj skydd</Accordion.HeaderWithTrigger>
        <Accordion.Content>
          {MockedTierItems.map((tier) => {
            return (
              <Accordion.TierItem
                key={tier.value}
                value={tier.value}
                title={tier.title}
                description={tier.description}
                price={tier.price}
                recommendedText={tier.recommendedText}
                isSelected={selected === tier.value}
                handleClick={() => handleClick(tier.value)}
              />
            )
          })}
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  )
}

export const Default = Template.bind({})
Default.args = {}
