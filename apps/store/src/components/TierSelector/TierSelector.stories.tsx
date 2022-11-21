import { ComponentMeta, ComponentStory } from '@storybook/react'
import { useState } from 'react'
import * as TierSelector from './TierSelector'

export default {
  title: 'TierSelector',
  component: TierSelector.Root,
} as ComponentMeta<typeof TierSelector.Root>

type MockedTierItemType = Array<TierSelector.TierItemProps>

const MockedTierItems: MockedTierItemType = [
  {
    value: '0',
    title: 'Trafikförsäkring',
    body: 'Grundläggande skydd för att köra bil',
    isSelected: false,
    price: '300 kr/mån',
  },
  {
    value: '1',
    title: 'Halvförsäkring Tack',
    body: 'Grundläggande skydd för att köra bil',
    isSelected: false,
    price: '300 kr/mån',
    recommendedText: 'Rekommenderad för din bil',
  },
  {
    value: '2',
    title: 'Halvförsäkring',
    body: 'Grundläggande skydd för att köra bil',
    isSelected: false,
    price: '300 kr/mån',
  },
  {
    value: '3',
    title: 'Halvförsäkring plus',
    body: 'Grundläggande skydd för att köra bil',
    isSelected: false,
    price: '300 kr/mån',
  },
]

const Template: ComponentStory<typeof TierSelector.Root> = () => {
  const [selected, setSelected] = useState<TierSelector.TierItemProps>()

  const handleClick = (item: string) => {
    const selectedItem = MockedTierItems.find((e) => e.value === item)
    setSelected(selectedItem)
  }

  return (
    <TierSelector.Root type="multiple">
      <TierSelector.Item value="item-1">
        <TierSelector.HeaderWithTrigger>
          {selected ? (
            <>
              <div>{selected?.title}</div>
              <TierSelector.SecondaryTextStyle>{selected?.price}</TierSelector.SecondaryTextStyle>
            </>
          ) : (
            <div>Välj skydd</div>
          )}
        </TierSelector.HeaderWithTrigger>
        <TierSelector.Content>
          {MockedTierItems.map((tier) => {
            const { value, body, price, title, recommendedText } = tier
            return (
              <TierSelector.TierItem
                key={value}
                value={value}
                title={title}
                body={body}
                price={price}
                recommendedText={recommendedText}
                isSelected={selected?.value === value}
                handleClick={() => handleClick(value)}
              />
            )
          })}
        </TierSelector.Content>
      </TierSelector.Item>
    </TierSelector.Root>
  )
}

export const Car = Template.bind({})
Car.args = {}
