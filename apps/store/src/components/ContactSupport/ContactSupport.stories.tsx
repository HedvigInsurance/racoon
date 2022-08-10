import { ComponentMeta, Story } from '@storybook/react'
import { ContactSupport, ContactSupportProps } from './ContactSupport'

export default {
  title: 'Contact Support',
  component: ContactSupport,
  argTypes: {},
} as ComponentMeta<typeof ContactSupport>

const Template: Story<ContactSupportProps> = (props) => {
  return <ContactSupport {...props} />
}

export const Default = Template.bind({})
Default.args = {
  title: 'Need help? Ask a soecialist.',
  showCallButton: true,
  availabilityText: 'Peter is available today 9-18.',
}
