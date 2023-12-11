import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import type { Meta, StoryObj } from '@storybook/react'
import { Stars } from './Stars'

const meta: Meta<typeof Stars> = {
  title: 'Components / Stars',
  component: Stars,
}

type Story = StoryObj<typeof Stars>

export const Mobile: Story = {
  args: { score: 3.5 },
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
      defaultViewport: 'iphone12',
    },
  },
}

export const Desktop: Story = {
  args: { score: 3.5 },
}

export default meta
