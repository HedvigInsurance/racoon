import { ComponentStory, ComponentMeta } from '@storybook/react'
import { HeadingLabel } from './HeadingLabel'

export default {
  title: 'Label',
  component: HeadingLabel,
} as ComponentMeta<typeof HeadingLabel>

const Template: ComponentStory<typeof HeadingLabel> = (args) => <HeadingLabel {...args} />

export const Default = Template.bind({})
Default.args = { children: 'Label' }
