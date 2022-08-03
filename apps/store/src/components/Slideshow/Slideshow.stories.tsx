import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Slideshow } from './Slideshow'

const Item = () => (
  <div style={{ width: '20.43rem', height: '25rem', backgroundColor: '#e3e3e3' }} />
)

export default {
  title: 'Slideshow',
  component: Slideshow,
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
      defaultViewport: 'iphonese2',
    },
  },
} as ComponentMeta<typeof Slideshow>

const Template: ComponentStory<typeof Slideshow> = (props) => (
  <Slideshow {...props}>
    <Item />
    <Item />
    <Item />
    <Item />
  </Slideshow>
)

export const Default = Template.bind({})
Default.args = {
  title: 'Top picks',
}
