import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { InputField } from './InputField'

export default {
  title: 'Input / InputField',
  component: InputField,
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
      defaultViewport: 'iphonese2',
    },
  },
} as ComponentMeta<typeof InputField>

const Template: ComponentStory<typeof InputField> = (props) => {
  return <InputField {...props} />
}
export const Default = Template.bind({})
Default.args = {
  placeholder: 'ÅÅMMDD-XXXX',
}
