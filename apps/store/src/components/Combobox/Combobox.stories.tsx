import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import type { Meta, StoryObj, StoryFn } from '@storybook/react'
import { useState } from 'react'
import { yStack } from 'ui'
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
  const availableSizes = ['small', 'medium', 'large'] as const
  const [selectedItem, setSelectedItem] = useState<Fruit | null>(FRUIT[1])

  return (
    <section className={yStack({ gap: 'lg' })}>
      {availableSizes.map((size) => (
        <div key={size} className={yStack({ gap: 'sm' })}>
          <p>{size.toUpperCase()}</p>
          <Combobox
            {...args}
            size={size}
            placeholder="Search fruit..."
            items={FRUIT}
            selectedItem={selectedItem}
            onSelectedItemChange={setSelectedItem}
            displayValue={(fruit) => fruit.name}
          />
        </div>
      ))}
    </section>
  )
}

export const Default: Story = {
  render: Template,
}
