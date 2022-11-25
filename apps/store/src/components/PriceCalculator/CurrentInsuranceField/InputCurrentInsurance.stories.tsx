import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { InputCurrentInsurance } from './InputCurrentInsurance'

export default {
  title: 'Input / Current Insurance',
  component: InputCurrentInsurance,
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
      defaultViewport: 'iphonese2',
    },
  },
  argTypes: { onCompanyChange: { action: 'changed' } },
} as ComponentMeta<typeof InputCurrentInsurance>

const Template: ComponentStory<typeof InputCurrentInsurance> = (props) => {
  return <InputCurrentInsurance {...props} />
}
export const Default = Template.bind({})
Default.args = {
  label: 'Are you already insured?',
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
