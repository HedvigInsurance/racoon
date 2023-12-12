import type { Meta, StoryObj } from '@storybook/react'
import { Rating } from './Rating'

const meta: Meta<typeof Rating> = {
  component: Rating,
}

type Story = StoryObj<typeof Rating>

export const Default: Story = {
  args: {
    score: 3.8,
    maxScore: 5,
    reviewsCount: 178,
    explanation: 'This is an explanation for how the rating is calculated',
  },
}

export default meta
