import { type Meta, type StoryObj } from '@storybook/react'
import { LoadingDots } from './LoadingDots'

const meta: Meta<typeof LoadingDots> = {
  component: LoadingDots,
  parameters: {
    layout: 'centered',
    paddings: [{ name: 'Large', value: '64px', default: true }],
    design: {
      allowFullscreen: true,
      type: 'figma',
      url: 'https://www.figma.com/file/qUhLjrKl98PAzHov9ilaDH/Hedvig-UI-Kit?type=design&node-id=1938-8577&mode=dev',
    },
  },
}
export default meta

type Story = StoryObj<typeof LoadingDots>

export const Info: Story = {}
