import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { Meta, StoryObj } from '@storybook/react'
import { InputSelect } from './InputSelect'

const meta: Meta<typeof InputSelect> = {
  title: 'Inputs / Select',
  component: InputSelect,
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
      defaultViewport: 'iphonese2',
    },
  },
}

export default meta
type Story = StoryObj<typeof InputSelect>

export const Small: Story = {
  args: {
    size: 'small',
    placeholder: 'Byggnadstyp',
    options: [
      { name: 'Garage', value: 'garage' },
      { name: 'Attefallshus', value: 'attefallshus' },
      { name: 'Växthus', value: 'växthus' },
      { name: 'Annan', value: 'annan' },
    ],
    name: 'Byggnadstyp',
  },
}

export const Large: Story = {
  args: {
    ...Small.args,
    size: 'large',
  },
}
