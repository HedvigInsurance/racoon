import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { PersonalNumberField } from './PersonalNumberField'

export default {
  title: 'Inputs/PersonalNumberField',
  component: PersonalNumberField,
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
      defaultViewport: 'iphonese2',
    },
  },
  argTypes: { onCompanyChange: { action: 'changed' } },
} as ComponentMeta<typeof PersonalNumberField>

const Template: ComponentStory<typeof PersonalNumberField> = (props) => {
  return <PersonalNumberField {...props} />
}
export const Default = Template.bind({})
Default.args = {
  label: 'ÅÅÅÅMMDDXXXX',
}
