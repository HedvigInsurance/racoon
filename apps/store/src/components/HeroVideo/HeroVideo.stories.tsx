import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { HeroVideo } from './HeroVideo'

export default {
  title: 'HeroVideo',
  component: HeroVideo,
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
      defaultViewport: 'iphonese2',
    },
  },
} as ComponentMeta<typeof HeroVideo>

const Template: ComponentStory<typeof HeroVideo> = () => {
  const sources = [
    {
      url: 'https://s3.eu-central-1.amazonaws.com/cdn.dev.hedvigit.com/pexels-kelly-lacy-9722139.mp4',
      format: 'video/mp4',
    },
  ]

  return <HeroVideo sources={sources} />
}
export const Default = Template.bind({})
Default.args = {}
