import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import * as Statistic from '@/components/Statistic/Statistic'
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

const Template: ComponentStory<typeof InsurableLimits> = () => {
  const limits = [
    { label: 'Deductible', value: 'SEK 1,500' },
    { label: 'Insured amount', value: 'SEK 1,000,000' },
    { label: 'Travel', value: 'Up to 45 days/trip when its a long trip' },
    { label: 'Bike coverage', value: 'Up to SEK 15,000' },
    { label: 'Bike coverage', value: 'Up to SEK 15,000' },
    { label: 'Bike coverage', value: 'Up to SEK 15,000' },
  ]
  return (
    <InsurableLimits>
      {limits.map((limit) => (
        <Statistic.Root key={limit.label}>
          <Statistic.Description>{limit.label}</Statistic.Description>
          <Statistic.Value>{limit.value}</Statistic.Value>
        </Statistic.Root>
      ))}
    </InsurableLimits>
  )
}
export const Default = Template.bind({})
Default.args = {}
