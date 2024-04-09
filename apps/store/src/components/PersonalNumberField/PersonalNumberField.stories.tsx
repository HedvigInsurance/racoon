import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import type { Meta, StoryFn } from '@storybook/react'
import { PersonalNumberField } from './PersonalNumberField'

export default {
  title: 'Inputs/PersonalNumberField',
  component: PersonalNumberField,
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
      defaultViewport: 'iphonese2',
    },
    grid: { width: '1/3' },
  },
  argTypes: { onCompanyChange: { action: 'changed' } },
} as Meta<typeof PersonalNumberField>

const Template: StoryFn<typeof PersonalNumberField> = (props) => {
  return <PersonalNumberField {...props} />
}
export const Default = Template.bind({})
Default.args = {
  label: 'ÅÅÅÅMMDDXXXX',
}
