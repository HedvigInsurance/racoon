import { Meta, StoryObj } from '@storybook/react'
import { LoadingSkeleton } from './LoadingSkeleton'

const meta: Meta<typeof LoadingSkeleton> = {
  title: 'Car Dealership / Loading Skeleton',
  component: LoadingSkeleton,
  parameters: { grid: { width: '1/3' } },
}

export default meta
type Story = StoryObj<typeof LoadingSkeleton>

export const Default: Story = {}
