import { Meta, StoryFn } from '@storybook/react'
import * as CheckList from './CheckList'

export default {
  title: 'Check List',
  component: CheckList.Root,
  argTypes: {},
} as Meta<typeof CheckList.Root>

const Template: StoryFn<typeof CheckList.Root> = () => {
  return (
    <CheckList.Root>
      <CheckList.Item>Something great about the insurance</CheckList.Item>
      <CheckList.Item>Another good thing</CheckList.Item>
      <CheckList.Item>Perhaps even a third thing could work</CheckList.Item>
      <CheckList.Item>Do we have to stop after four?</CheckList.Item>
      <CheckList.Item>No, let&apos;s say one more good thing</CheckList.Item>
    </CheckList.Root>
  )
}

export const Default = Template.bind({})
Default.args = {}
