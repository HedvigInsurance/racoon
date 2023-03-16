import { ComponentMeta, StoryFn } from '@storybook/react'
import { useState } from 'react'
import { Combobox } from './Combobox'

export default {
  title: 'Combobox',
  component: Combobox,
  argTypes: {},
} as ComponentMeta<typeof Combobox>

const FRUIT = [
  {
    id: '1',
    name: 'Apple',
  },
  {
    id: '2',
    name: 'Pear',
  },
  {
    id: '3',
    name: 'Banana',
  },
]

type Fruit = (typeof FRUIT)[number]

export const Default: StoryFn = () => {
  const [selectedItem, setSelectedItem] = useState<Fruit | null>(FRUIT[1])

  return (
    <Combobox
      placeholder="Search fruit..."
      items={FRUIT}
      selectedItem={selectedItem}
      onSelectedItemChange={setSelectedItem}
      displayValue={(fruit) => fruit.name}
    />
  )
}
