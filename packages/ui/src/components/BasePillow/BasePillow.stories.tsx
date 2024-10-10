import type { Meta, StoryObj } from '@storybook/react'
import { type ComponentProps } from 'react'
import { BasePillow } from './BasePillow'

type Controls = ComponentProps<typeof BasePillow>

const meta: Meta<Controls> = {
  title: 'BasePillow',
  component: BasePillow,
  argTypes: {
    size: {
      options: ['mini', 'xxsmall', 'xsmall', 'small', 'medium', 'large', 'xlarge', 'xxlarge'],
      control: { type: 'select' },
    },
    fill: {
      control: { type: 'text' },
    },
  },
}

export default meta

type Story = StoryObj<Controls>

export const Default: Story = {
  render: ({ size, fill }: Controls) => <BasePillow size={size} fill={fill} />,
  args: {
    size: 'medium',
    fill: 'rebeccapurple',
  },
}
