import { ComponentMeta, StoryFn } from '@storybook/react'
import { Breed } from '@/services/PriceCalculator/Field.types'
import { MixedBreedPicker } from './MixedBreedPicker'

export default {
  title: 'Inputs / Mixed Breed Picker',
  component: MixedBreedPicker,
} as ComponentMeta<typeof MixedBreedPicker>

const BREEDS: Array<Breed> = [
  {
    id: '1',
    displayName: 'Foxhound',
  },
  {
    id: '2',
    displayName: 'Poodle',
  },
  {
    id: '3',
    displayName: 'Labrador',
  },
  {
    id: '4',
    displayName: 'Pug',
  },
  {
    id: '5',
    displayName: 'Bulldog',
  },
]

export const Default: StoryFn<typeof MixedBreedPicker> = () => {
  return <MixedBreedPicker breeds={BREEDS} />
}
