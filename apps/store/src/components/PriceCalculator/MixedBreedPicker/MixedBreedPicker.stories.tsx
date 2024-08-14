import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import type { Meta, StoryFn } from '@storybook/react'
import type { Breed } from '@/services/PriceCalculator/Field.types'
import { MixedBreedPicker } from './MixedBreedPicker'

export default {
  title: 'Inputs / Mixed Breed Picker',
  component: MixedBreedPicker,
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
      defaultViewport: 'iphonese2',
    },
    grid: { width: '1/3' },
  },
} as Meta<typeof MixedBreedPicker>

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
