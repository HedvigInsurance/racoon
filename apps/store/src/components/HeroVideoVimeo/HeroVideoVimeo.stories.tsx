import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { ComponentMeta, ComponentStory } from '@storybook/react'
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
} as ComponentMeta<typeof HeroVideoVimeo>

const Template: ComponentStory<typeof HeroVideoVimeo> = () => {
  return <HeroVideoVimeo videoId="76979871" height="60vh" />
}
export const Default = Template.bind({})
Default.args = {}
