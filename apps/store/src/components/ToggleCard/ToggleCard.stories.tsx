import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import type { Meta, StoryObj } from '@storybook/react'
import { ToggleCard } from './ToggleCard'

const meta: Meta<typeof ToggleCard> = {
  title: 'Inputs/ToggleCard',
  component: ToggleCard,
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
      defaultViewport: 'iphonese2',
    },
    grid: { width: '1/3' },
  },
}

export default meta
type Story = StoryObj<typeof ToggleCard>

export const Default: Story = {
  args: {
    label: 'Has water connected',
  },
}
