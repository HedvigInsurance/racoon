import { ComponentMeta } from '@storybook/react'
import React from 'react'
import { storyPageMock } from '@/services/storyblok/mockStoryData'
import { HomePage } from './HomePage'

export default {
  title: 'HomePage',
  component: HomePage,
} as ComponentMeta<typeof HomePage>

export const Default = <HomePage {...storyPageMock} />
