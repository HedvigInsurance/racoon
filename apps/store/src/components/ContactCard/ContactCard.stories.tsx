import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { ContactCard } from './ContactCard'

export default {
  title: 'Contact Card',
  component: ContactCard,
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
      defaultViewport: 'iphonese2',
    },
  },
} as ComponentMeta<typeof ContactCard>

const Template: ComponentStory<typeof ContactCard> = (props) => {
  return <ContactCard {...props} />
}

export const Default = Template.bind({})
Default.args = {
  icon: 'Icon',
  subject: 'Subject',
  details: 'Good Deets here',
}
