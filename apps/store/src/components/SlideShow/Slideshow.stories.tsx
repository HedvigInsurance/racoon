import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { ProductCard } from '@/components/ProductCard/ProductCard'
import { Slideshow } from './Slideshow'

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

const Template: ComponentStory<typeof Slideshow> = (props) => <Slideshow {...props} />

export const Default = Template.bind({})
Default.args = {
  children: [
    <ProductCard
      key="home"
      title="Hedvig Home"
      subtitle="Complete coverage for your home"
      image={{ src: 'https://via.placeholder.com/327x400' }}
    />,
    <ProductCard
      key="house"
      title="Hedvig House"
      subtitle="Complete coverage for your house"
      image={{ src: 'https://via.placeholder.com/327x400' }}
    />,
    <ProductCard
      key="car"
      title="Hedvig Car"
      subtitle="Complete coverage for your car"
      image={{ src: 'https://via.placeholder.com/327x400' }}
    />,
    <ProductCard
      key="accident"
      title="Hedvig Accident"
      subtitle="Complete coverage for when you need most"
      image={{ src: 'https://via.placeholder.com/327x400' }}
    />,
  ],
}
