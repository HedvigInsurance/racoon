import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { ToggleCard } from './ToggleCard'

export default {
  title: 'Inputs/ToggleCard',
  component: ToggleCard,
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
      defaultViewport: 'iphonese2',
    },
  },
} as ComponentMeta<typeof ToggleCard>

const Template: ComponentStory<typeof ToggleCard> = (props) => {
  return <ToggleCard {...props} />
}

export const Default = Template.bind({})
Default.args = {
  label: 'Has water connected',
}
