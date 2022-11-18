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
  const [selected, setSelected] = useState<Accordion.TierItemProps>()

  const handleClick = (item: string) => {
    const selectedItem = MockedTierItems.find((e) => e.value === item)
    setSelected(selectedItem)
  }

  return (
    <Accordion.Root type="multiple">
      <Accordion.Item value="item-1">
        <Accordion.HeaderWithTrigger>
          {selected ? (
            <>
              <div>{selected?.title}</div>
              <div>{selected?.price}</div>
            </>
          ) : (
            <div>Välj skydd</div>
          )}
        </Accordion.HeaderWithTrigger>
        <Accordion.Content>
          {MockedTierItems.map((tier) => {
            const { value, description, price, title, recommendedText } = tier
            return (
              <Accordion.TierItem
                key={value}
                value={value}
                title={title}
                description={description}
                price={price}
                recommendedText={recommendedText}
                isSelected={selected?.value === value}
                handleClick={() => handleClick(value)}
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
