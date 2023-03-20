import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { Meta, StoryFn } from '@storybook/react'
import { InputCurrentInsurance } from './InputCurrentInsurance'

export default {
  title: 'Inputs/Current Insurance',
  component: InputCurrentInsurance,
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
      defaultViewport: 'iphonese2',
    },
  },
  argTypes: { onCompanyChange: { action: 'changed' } },
} as Meta<typeof InputCurrentInsurance>

const Template: StoryFn<typeof InputCurrentInsurance> = (props) => {
  return <InputCurrentInsurance {...props} />
}
export const Default = Template.bind({})
Default.args = {
  label: 'Do you already have home insurance?',
  companyOptions: [
    {
      name: 'Folksam',
      value: 'se-folksam',
    },
    {
      name: 'Trygg Hansa',
      value: 'se-trygg-hansa',
    },
  ],
}
