import type { StoryObj, Meta } from '@storybook/react'
import { Heading } from './Heading'

const meta: Meta<typeof Heading> = {
  title: 'Heading',
  component: Heading,
  parameters: {
    backgrounds: {
      default: 'Light',
    },
  },
  args: {
    variant: 'serif.72',
    children: 'This is a Heading',
  },
}

export default meta
type Story = StoryObj<typeof Heading>

export const LightBackground: Story = {
  parameters: { backgrounds: { default: 'Light' } },
  args: { color: 'textPrimary' },
}

export const DarkBackground: Story = {
  parameters: { backgrounds: { default: 'Dark' } },
  args: { color: 'textNegative' },
}
