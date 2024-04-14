import type { Meta, StoryObj } from '@storybook/react'
import { theme } from '../../theme'
import { HedvigSymbol } from './HedvigSymbol'

const meta: Meta<typeof HedvigSymbol> = {
  title: 'Logotypes / Hedvig Symbol',
  component: HedvigSymbol,
}

export default meta
type Story = StoryObj<typeof HedvigSymbol>

export const Dark: Story = {}

export const Light: Story = {
  args: {
    color: theme.colors.light,
  },
  parameters: {
    backgrounds: { default: 'Dark' },
  },
}
