import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import type { Meta, StoryObj } from '@storybook/react'
import { InputSelect } from './InputSelect'

const meta: Meta<typeof InputSelect> = {
  title: 'Inputs / Select',
  component: InputSelect,
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
      defaultViewport: 'iphonese2',
    },
    grid: { width: '1/3' },
  },
  args: {
    name: 'buildingType',
    placeholder: 'Choose building type',
    label: 'Building type',
    options: [
      { name: 'Garage', value: 'garage' },
      { name: 'Attefallshus', value: 'attefallshus' },
      { name: 'Greenhouse', value: 'greenhouse' },
      { name: 'Very long building type so it gets clipped', value: 'longlong' },
      { name: 'Other', value: 'other' },
    ],
  },
}

export default meta
type Story = StoryObj<typeof InputSelect>

export const Small: Story = {
  args: {
    size: 'small',
  },
}

export const Medium: Story = {
  args: {
    size: 'medium',
  },
}

export const Large: Story = {
  args: {
    size: 'large',
  },
}
