import { ComponentMeta, ComponentStory } from '@storybook/react'
import { HedvigLogo } from './hedvig-logo'

export default {
  title: 'Hedvig Logo',
  component: HedvigLogo,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof HedvigLogo>

const Template: ComponentStory<typeof HedvigLogo> = (args) => <HedvigLogo {...args} />

export const Primary = Template.bind({})
Primary.args = {
  width: 94,
}
