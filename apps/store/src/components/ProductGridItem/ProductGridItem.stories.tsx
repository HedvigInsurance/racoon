import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import type { Meta, StoryObj } from '@storybook/react'
import { ProductGridItem } from './ProductGridItem'

const meta: Meta<typeof ProductGridItem> = {
  component: ProductGridItem,
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
type Story = StoryObj<typeof ProductGridItem>

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
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
}
