import { ComponentMeta, Story } from '@storybook/react'
import React from 'react'
import { LoadingDots, LoadingDotsProps } from './LoadingDots'

export default {
  title: 'Loading Dots',
  component: LoadingDots,
  parameters: {
    layout: 'centered',
    paddings: [{ name: 'Large', value: '64px', default: true }],
  },
} as ComponentMeta<typeof LoadingDots>

const Template: Story<LoadingDotsProps> = (props) => {
  return <LoadingDots {...props} />
}

export const Default = Template.bind({})
