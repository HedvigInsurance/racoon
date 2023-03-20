import { Meta, StoryFn } from '@storybook/react'
import { HeadingLabel } from './HeadingLabel'

export default {
  title: 'Label',
  component: HeadingLabel,
} as Meta<typeof HeadingLabel>

const Template: StoryFn<typeof HeadingLabel> = (args) => <HeadingLabel {...args} />

export const Default = Template.bind({})
Default.args = { children: 'Label' }
