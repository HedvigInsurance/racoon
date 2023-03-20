import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { Meta, StoryFn } from '@storybook/react'
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
} as Meta<typeof ToggleCard>

const Template: StoryFn<typeof ToggleCard> = (props) => {
  return <ToggleCard {...props} />
}

export const Default = Template.bind({})
Default.args = {
  label: 'Has water connected',
}
