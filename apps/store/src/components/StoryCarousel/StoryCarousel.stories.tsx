import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import type { Meta, StoryObj } from '@storybook/react'
import { StoryCarousel } from './StoryCarousel'

const IMAGES = [
  {
    id: 'image1',
    src: 'https://plus.unsplash.com/premium_photo-1691434474131-01f982a2dab1?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: 'image 1',
  },
  {
    id: 'image2',
    src: 'https://images.unsplash.com/photo-1609154767012-331529e7d73b?q=80&w=2977&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: 'image 2',
  },
  {
    id: 'image3',
    src: 'https://images.unsplash.com/photo-1626948688703-0136bc0a90da?q=80&w=3456&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: 'image 3',
  },
  {
    id: 'image4',
    src: 'https://images.unsplash.com/photo-1500817487388-039e623edc21?q=80&w=2571&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: 'image 4',
  },
]

export default {
  title: 'Components / StoryCarousel',
  component: StoryCarousel,
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
      defaultViewport: 'iphone6',
    },
  },
} as Meta<typeof StoryCarousel>

type Story = StoryObj<typeof StoryCarousel>

export const Default: Story = {
  args: { images: IMAGES },
}
