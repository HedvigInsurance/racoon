import { Meta, StoryFn } from '@storybook/react'
import { HedvigLogo } from './HedvigLogo'

export default {
  title: 'Hedvig Logo',
  component: HedvigLogo,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta<typeof HedvigLogo>

const Template: StoryFn<typeof HedvigLogo> = (args) => <HedvigLogo {...args} />

export const Primary = Template.bind({})
Primary.args = {
  width: 94,
}
