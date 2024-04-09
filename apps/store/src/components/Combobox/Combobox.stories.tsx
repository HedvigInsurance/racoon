import type { Meta, StoryFn } from '@storybook/react'
import { useState } from 'react'
import { Combobox } from './Combobox'

export default {
  title: 'Inputs / Combobox',
  component: Combobox,
  argTypes: {},
  parameters: { grid: { width: '1/3' } },
} as Meta<typeof Combobox>

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
