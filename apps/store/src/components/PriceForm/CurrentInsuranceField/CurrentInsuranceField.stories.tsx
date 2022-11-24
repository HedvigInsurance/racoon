import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { CurrentInsuranceField } from './CurrentInsuranceField'

export default {
  title: 'Input / Current Insurance Field',
  component: CurrentInsuranceField,
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
      defaultViewport: 'iphonese2',
    },
  },
  argTypes: { onCompanyChange: { action: 'changed' } },
} as ComponentMeta<typeof CurrentInsuranceField>

const Template: ComponentStory<typeof CurrentInsuranceField> = (props) => {
  return <CurrentInsuranceField {...props} />
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
