import { ComponentMeta, Story } from '@storybook/react'
import { LinkField } from '@/services/storyblok/storyblok'
import { ContactSupport, ContactSupportProps } from './ContactSupport'

export default {
  title: 'Contact Support',
  component: ContactSupport,
  argTypes: {},
} as ComponentMeta<typeof ContactSupport>

const Template: Story<ContactSupportProps> = (props) => {
  return <ContactSupport {...props} />
}

const linkField: LinkField = {
  id: '1234',
  url: 'https://hedvigapp.typeform.com/to/p0m0QakI',
  linktype: 'url',
}

export const Default = Template.bind({})
Default.args = {
  title: 'Våra specialister finns här för dig',
  chatTitle: 'Chatta med oss',
  phoneTitle: 'Teckna via telefon',
  chatOpeningHours: '9.00–22.00',
  phoneOpeningHours: '10.00–17.00',
  phoneLink: linkField,
}
