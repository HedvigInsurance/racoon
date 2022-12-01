import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Video } from './Video'

export default {
  title: 'Video',
  component: Video,
} as ComponentMeta<typeof Video>

const Template: ComponentStory<typeof Video> = (args) => <Video {...args} />

export const Default = Template.bind({})
Default.args = {
  sources: [
    { url: 'https://cdn.dev.hedvigit.com/assets/videos/HEDVIG_FILM01_1x1_15sec_CLEAN.mp4' },
  ],
}
