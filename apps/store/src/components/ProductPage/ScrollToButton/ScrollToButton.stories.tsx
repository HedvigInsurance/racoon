import { ComponentMeta, ComponentStory } from '@storybook/react'
import { ScrollToTopButton } from './ScrollToButton'

export default {
  title: 'Product Page / Scroll To Top Button',
  component: ScrollToTopButton,
  argTypes: {},
} as ComponentMeta<typeof ScrollToTopButton>

const Template: ComponentStory<typeof ScrollToTopButton> = (props) => {
  return <ScrollToTopButton {...props} />
}

export const Default = Template.bind({})
Default.args = {
  children: 'Calculate your price',
}
