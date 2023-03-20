import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { Meta, StoryFn } from '@storybook/react'
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
} as Meta<typeof InputSelect>

const Template: StoryFn<typeof InputSelect> = (props) => {
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
