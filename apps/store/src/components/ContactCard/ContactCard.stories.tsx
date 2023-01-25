import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Text } from 'ui'
import { ContactCard } from './ContactCard'

export default {
  title: 'Contact Card',
  component: ContactCard,
  parameters: {
    layout: 'centered',
    viewport: {
      viewports: INITIAL_VIEWPORTS,
      defaultViewport: 'iphonese2',
    },
  },
} as ComponentMeta<typeof ContactCard>

const Template: ComponentStory<typeof ContactCard> = () => {
  return (
    <div style={{ maxWidth: '220px' }}>
      <ContactCard icon="icon">
        <Text size={{ _: 'sm', md: 'md' }}>Chatta med oss</Text>
        <Text size={{ _: 'sm', md: 'md' }} color="textSecondary">
          9.00 - 22.00
        </Text>
      </ContactCard>
    </div>
  )
}

export const Default = Template.bind({})
Default.args = {
  icon: 'Icon',
}
