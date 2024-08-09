import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import type { Meta, StoryObj, StoryFn } from '@storybook/react'
import { useState } from 'react'
import { Combobox } from './Combobox'

export default {
  title: 'Inputs / Combobox',
  component: Combobox,
  argTypes: {},
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
      defaultViewport: 'iphonese2',
    },
    grid: { width: '1/3' },
  },
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

type Story = StoryObj<typeof Combobox<Fruit>>

const Template: StoryFn<typeof Combobox<Fruit>> = (args) => {
  const [selectedItem, setSelectedItem] = useState<Fruit | null>(FRUIT[1])

  return (
    <Combobox
      {...args}
      placeholder="Search fruit..."
      items={FRUIT}
      selectedItem={selectedItem}
      onSelectedItemChange={setSelectedItem}
      displayValue={(fruit) => fruit.name}
    />
  )
}

export const Small: Story = {
  render: Template,
  args: {
    size: 'small',
  },
}

export const Medium: Story = {
  render: Template,
  args: {
    size: 'medium',
  },
}

export const Large: Story = {
  render: Template,
  args: {
    size: 'large',
  },
}
