import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { InsurableLimits } from './InsurableLimits'

export default {
  title: 'InsurableLimits',
  component: InsurableLimits,
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
      defaultViewport: 'iphonese2',
    },
  },
} as ComponentMeta<typeof InsurableLimits>

const Template: ComponentStory<typeof InsurableLimits> = (props) => <InsurableLimits {...props} />

export const Default = Template.bind({})
Default.args = {
  limits: [
    { label: 'Deductible', value: 'SEK 1,500' },
    { label: 'Insured amount', value: 'SEK 1,000,000' },
    { label: 'Travel', value: 'Up to 45 days/trip when its a long trip' },
    { label: 'Bike coverage', value: 'Up to SEK 15,000' },
    { label: 'Bike coverage', value: 'Up to SEK 15,000' },
    { label: 'Bike coverage', value: 'Up to SEK 15,000' },
  ],
}
