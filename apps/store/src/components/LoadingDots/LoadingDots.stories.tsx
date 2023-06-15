import { Meta, StoryFn } from '@storybook/react'
import React from 'react'
import { LoadingDots, LoadingDotsProps } from './LoadingDots'

export default {
  component: LoadingDots,
  parameters: {
    layout: 'centered',
    paddings: [{ name: 'Large', value: '64px', default: true }],
  },
} as Meta<typeof LoadingDots>

export const Default: StoryFn<LoadingDotsProps> = (props) => {
  return <LoadingDots {...props} />
}
