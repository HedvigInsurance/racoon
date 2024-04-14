import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import type { Meta, StoryFn } from '@storybook/react'
import { Slideshow } from './Slideshow'

const Item = () => (
  <div style={{ width: '20.43rem', height: '25rem', backgroundColor: '#e3e3e3' }} />
)

const meta: Meta<typeof Slideshow> = {
  component: Slideshow,
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
      defaultViewport: 'iphonese2',
    },
  },
}

export default meta

const Template: StoryFn<typeof Slideshow> = (props) => (
  <Slideshow {...props}>
    <Item />
    <Item />
    <Item />
    <Item />
  </Slideshow>
)

export const Default = {
  render: Template,
  args: {
    title: 'Top picks',
  },
}
