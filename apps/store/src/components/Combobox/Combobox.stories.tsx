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
  const [value, setValue] = useState<Fruit | null>(FRUIT[1])

  return (
    <Combobox
      placeholder="Search fruit..."
      items={FRUIT}
      defaultValue={value}
      onSelect={setValue}
      displayValue={(fruit) => fruit.name}
    />
  )
}

export const NoOptionFound: StoryFn = () => {
  return <Combobox items={['Apple', 'Pear', 'Banana']} defaultValue="Plu" />
}
