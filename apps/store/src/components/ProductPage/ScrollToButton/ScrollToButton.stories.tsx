import { Meta, StoryFn } from '@storybook/react'
import { ScrollToTopButton } from './ScrollToButton'

export default {
  title: 'Product Page / Scroll To Top Button',
  component: ScrollToTopButton,
  argTypes: {},
} as Meta<typeof ScrollToTopButton>

const Template: StoryFn<typeof ScrollToTopButton> = (props) => {
  return <ScrollToTopButton {...props} />
}

export const Default = Template.bind({})
Default.args = {
  children: 'Calculate your price',
}
