import { ComponentMeta } from '@storybook/react'
import React from 'react'
import { LoadingDots } from './LoadingDots'

export default {
  title: 'Loading Dots',
  component: LoadingDots,
  parameters: {
    paddings: [{ name: 'Large', value: '64px', default: true }],
  },
} as ComponentMeta<typeof LoadingDots>

export const Default = () => <LoadingDots />
