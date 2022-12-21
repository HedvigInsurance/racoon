import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Video } from './Video'

export default {
  title: 'Video',
  component: Video,
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
      defaultViewport: 'iphone12',
    },
  },
} as ComponentMeta<typeof Video>

const Template: ComponentStory<typeof Video> = (args) => <Video {...args} />

export const Default = Template.bind({})
Default.args = {
  autoPlay: true,
  sources: [
    { url: 'https://cdn.dev.hedvigit.com/assets/videos/HEDVIG_FILM01_1x1_15sec_CLEAN.mp4' },
  ],
}

export const ProductVideo = Template.bind({})
ProductVideo.args = {
  autoPlay: true,
  sources: [
    { url: 'https://cdn.dev.hedvigit.com/assets/videos/HEDVIG_FILM01_1x1_15sec_CLEAN.mp4' },
  ],
  aspectRatioPortrait: '4 / 6',
  maxHeightPortrait: 80,
  aspectRatioLandscape: '1 / 1',
  maxHeightLandscape: 90,
}
