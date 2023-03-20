import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { Meta, StoryFn } from '@storybook/react'
import { HeroVideoVimeo } from './HeroVideoVimeo'

export default {
  title: 'HeroVimeoVideo',
  component: HeroVideoVimeo,
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
      defaultViewport: 'iphonese2',
    },
  },
} as Meta<typeof HeroVideoVimeo>

const Template: StoryFn<typeof HeroVideoVimeo> = () => {
  return <HeroVideoVimeo videoId="76979871" height="60vh" />
}
export const Default = Template.bind({})
Default.args = {}
