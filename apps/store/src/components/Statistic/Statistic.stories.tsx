import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Statistic } from './Statistic'

export default {
  title: 'Statistic',
  component: Statistic,
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
      defaultViewport: 'iphonese2',
    },
  },
} as ComponentMeta<typeof Statistic>

const Template: ComponentStory<typeof Statistic> = (props) => <Statistic {...props} />

export const Default = Template.bind({})
Default.args = {
  label: 'Deductible',
  value: 'SEK 1,500',
}
