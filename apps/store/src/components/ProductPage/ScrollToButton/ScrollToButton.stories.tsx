import { ComponentMeta, Story } from '@storybook/react'
import { ScrollToButton, ScrollToButtonProps } from './ScrollToButton'

export default {
  title: 'Product Page / Scroll To Button',
  component: ScrollToButton,
  argTypes: {},
} as ComponentMeta<typeof ScrollToButton>

const Template: Story<ScrollToButtonProps> = (props) => {
  return <ScrollToButton {...props} />
}

export const Default = Template.bind({})
Default.args = {
  children: 'Calculate your price',
}
