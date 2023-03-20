import { Meta, StoryFn } from '@storybook/react'
import { LinkField } from '@/services/storyblok/storyblok'
import { ContactSupport, ContactSupportProps } from './ContactSupport'

export default {
  title: 'Contact Support',
  component: ContactSupport,
  argTypes: {},
} as Meta<typeof ContactSupport>

const Template: StoryFn<ContactSupportProps> = (props) => {
  return <ContactSupport {...props} />
}

const linkField: LinkField = {
  id: '1234',
  url: 'https://hedvigapp.typeform.com/to/p0m0QakI',
  linktype: 'url',
}

export const Default = Template.bind({})
Default.args = {
  chatTitle: 'Chatta med oss',
  phoneTitle: 'Teckna via telefon',
  chatOpeningHours: '9.00–22.00',
  phoneOpeningHours: '10.00–17.00',
  phoneLink: linkField,
}
