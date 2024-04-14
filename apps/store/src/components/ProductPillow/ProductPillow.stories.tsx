import type { Meta, StoryObj } from '@storybook/react'
import type { ProductPillowProps } from './ProductPillow'
import { ProductPillow } from './ProductPillow'

const meta: Meta<typeof ProductPillow> = {
  title: 'Product Pillows / Product Pillow',
  component: ProductPillow,
  argTypes: {},
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<ProductPillowProps>

export const Default: Story = {
  args: {
    name: 'Olycksfall',
    image: 'https://a.storyblok.com/f/165473/832x832/fa27811442/hedvig-pillow-home.png',
    url: '/',
  },
}
