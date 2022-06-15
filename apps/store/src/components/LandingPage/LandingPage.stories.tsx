import { ComponentMeta } from '@storybook/react'
import React from 'react'
import { LandingPage } from './LandingPage'

export default {
  title: 'LandingPage',
  component: LandingPage,
} as ComponentMeta<typeof LandingPage>

export const Default = <LandingPage />
