import type { Meta, StoryObj } from '@storybook/react'
import { ScrollToTopButton } from './ScrollToButton'

const meta: Meta<typeof ScrollToTopButton> = {
  title: 'Product Page / Scroll To Top Button',
  component: ScrollToTopButton,
  argTypes: {},
}

export default meta
type Story = StoryObj<typeof ScrollToTopButton>

export const Default: Story = {
  args: {
    children: 'Calculate your price',
  },
}
