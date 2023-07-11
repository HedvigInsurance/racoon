import { Meta, StoryObj } from '@storybook/react'
import { ProductHero } from './ProductHero'

const meta: Meta<typeof ProductHero> = {
  title: 'Purchase Form / Product Hero',
  component: ProductHero,
  parameters: {
    viewport: {
      defaultViewport: 'mobile2',
    },
  },
}

export default meta
type Story = StoryObj<typeof ProductHero>

export const Large: Story = {
  args: {
    name: 'Home Insurance Rental',
    description: 'All-risk included · No binding period',
    pillow: {
      src: 'https://a.storyblok.com/f/165473/832x832/fb3ddd4632/hedvig-pillows-rental.png',
    },
    size: 'large',
  },
}

export const Small: Story = {
  args: {
    ...Large.args,
    size: 'small',
  },
}
