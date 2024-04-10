import type { Meta, StoryObj } from '@storybook/react'
import { theme } from '../../theme'
import { HedvigLogo } from './HedvigLogo'

const meta: Meta<typeof HedvigLogo> = {
  title: 'Logotypes / Hedvig Logo',
  component: HedvigLogo,
}

export default meta
type Story = StoryObj<typeof HedvigLogo>

export const Dark: Story = {
  args: {
    width: 94,
  },
}

export const Light: Story = {
  args: {
    width: 94,
    color: theme.colors.light,
  },

  parameters: {
    backgrounds: { default: 'Dark' },
  },
}
