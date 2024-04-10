import type { Meta, StoryObj } from '@storybook/react'
import { TopPickCard } from './TopPickCard'

const meta: Meta<typeof TopPickCard> = {
  component: TopPickCard,
}

export default meta
type Story = StoryObj<typeof TopPickCard>

export const Default: Story = {
  args: {
    title: 'Hedvig Home',
    subtitle: 'Complete coverage for your home',
    image: { src: 'https://via.placeholder.com/327x400' },
  },
}
