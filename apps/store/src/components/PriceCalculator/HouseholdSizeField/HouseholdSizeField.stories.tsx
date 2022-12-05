import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { HouseholdSizeField } from './HouseholdSizeField'

export default {
  title: 'Input / Household Size',
  component: HouseholdSizeField,
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
      defaultViewport: 'iphonese2',
    },
  },
} as ComponentMeta<typeof HouseholdSizeField>

const Template: ComponentStory<typeof HouseholdSizeField> = (props) => {
  return <HouseholdSizeField {...props} />
}
export const Default = Template.bind({})
Default.args = {
  field: {
    type: 'householdSize',
    name: 'numberCoInsured',
    label: { key: 'Household Size' },
    max: 5,
  },
}
