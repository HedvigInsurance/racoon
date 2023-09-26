import { Meta, StoryFn } from '@storybook/react'
import { LinkField } from '@/services/storyblok/storyblok'
import { ContactSupport, ContactSupportProps } from './ContactSupport'

export default {
  component: ContactSupport,
  argTypes: {},
  parameters: {
    design: {
      allowFullscreen: true,
      type: 'figma',
      url: 'https://www.figma.com/file/qUhLjrKl98PAzHov9ilaDH/Hedvig-UI-Kit?type=design&node-id=947-6989&mode=design&t=RSlyuJ47E727hGaQ-4',
    },
  },
} as Meta<typeof ContactSupport>

const Template: StoryFn<ContactSupportProps> = (props) => {
  return <ContactSupport {...props} />
}

const linkField: LinkField = {
  id: '1234',
  url: 'https://hedvigapp.typeform.com/to/p0m0QakI',
  linktype: 'url',
  cached_url: 'https://hedvigapp.typeform.com/to/p0m0QakI',
}

export const Default = Template.bind({})
Default.args = {
  chatTitle: 'Chatta med oss',
  phoneTitle: 'Teckna via telefon',
  chatOpeningHours: '9.00–22.00',
  phoneOpeningHours: '10.00–17.00',
  phoneLink: linkField,
}
