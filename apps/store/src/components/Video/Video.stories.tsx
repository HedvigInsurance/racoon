import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import type { Meta, StoryObj } from '@storybook/react'
import { Video } from './Video'

const meta: Meta<typeof Video> = {
  component: Video,
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
      defaultViewport: 'iphone12',
    },
    grid: { width: '1/2' },
  },
}

export default meta
type Story = StoryObj<typeof Video>

export const Default: Story = {
  args: {
    autoPlay: true,
    sources: [{ url: 'https://cdn.hedvig.com/hedvig-dot-com/videos/pillow-hero.webm' }],
    showControls: true,
  },
}

export const ProductVideo: Story = {
  args: {
    autoPlay: true,
    sources: [
      { url: 'https://cdn.dev.hedvigit.com/assets/videos/HEDVIG_FILM01_1x1_15sec_CLEAN.mp4' },
    ],
    aspectRatioPortrait: '4 / 6',
    maxHeightPortrait: '80',
    aspectRatioLandscape: '1 / 1',
    maxHeightLandscape: '90',
  },
}
