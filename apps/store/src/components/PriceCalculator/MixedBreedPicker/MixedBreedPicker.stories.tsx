import { ComponentMeta, StoryFn } from '@storybook/react'
import { useState } from 'react'
import { MixedBreedPicker } from './MixedBreedPicker'

export default {
  title: 'Inputs / Mixed Breed Picker',
  component: MixedBreedPicker,
  // argTypes: { onCompanyChange: { action: 'changed' } },
} as ComponentMeta<typeof MixedBreedPicker>

const INITIAL_STATE = [
  { id: '1', displayName: 'Foxhound' },
  { id: '2', displayName: 'Poodle' },
]

type Item = (typeof INITIAL_STATE)[number]

export const Default: StoryFn<typeof MixedBreedPicker> = () => {
  const [items, setItems] = useState(INITIAL_STATE)

  const handleSubmitDelete = (item: Item) => {
    setItems(items.filter((prevItem) => prevItem.id !== item.id))
  }

  const handleSubmitAdd = (item: Item) => {
    setItems([...items, item])
  }

  return (
    <MixedBreedPicker
      items={items}
      onSubmitAdd={handleSubmitAdd}
      loadingAdd={false}
      onSubmitDelete={handleSubmitDelete}
      loadingDelete={false}
    />
  )
}
