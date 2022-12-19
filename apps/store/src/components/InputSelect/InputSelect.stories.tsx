import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { InputSelect } from './InputSelect'

export default {
  title: 'Inputs / Select',
  component: InputSelect,
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
      defaultViewport: 'iphonese2',
    },
  },
} as ComponentMeta<typeof InputSelect>

const Template: ComponentStory<typeof InputSelect> = (props) => {
  return <InputSelect {...props} />
}
export const Default = Template.bind({})
Default.args = {
  placeholder: 'Byggnadstyp',
  options: [
    { name: 'Garage', value: 'garage' },
    { name: 'Attefallshus', value: 'attefallshus' },
    { name: 'Växthus', value: 'växthus' },
    { name: 'Annan', value: 'annan' },
  ],
  name: 'Byggnadstyp',
}
