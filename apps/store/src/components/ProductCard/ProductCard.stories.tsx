import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import type { Meta, StoryObj } from '@storybook/react'
import { ProductCard } from './ProductCard'

const meta: Meta<typeof ProductCard> = {
  component: ProductCard,
  argTypes: {},
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
      defaultViewport: 'iphone12',
    },
    grid: { width: '1/3' },
  },
}

export default meta
type Story = StoryObj<typeof ProductCard>

export const Default: Story = {
  args: {
    title: 'Hedvig Car',
    subtitle: 'Lörem ipsum dålor, nufs plufs glufs och gruls.',
    image: {
      src: 'https://s3.eu-central-1.amazonaws.com/cdn.dev.hedvigit.com/giraffe_wallpaper.jpg',
    },
    aspectRatio: '4 / 5',
    link: { url: '/', type: 'product' },
  },
}
