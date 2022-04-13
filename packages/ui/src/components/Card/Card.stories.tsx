import styled from '@emotion/styled'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { useState } from 'react'
import { Spacing } from '../Spacing/Spacing'
import { Card } from './Card'

export default {
  title: 'UI / Card',
  component: Card,
  args: {},
} as ComponentMeta<typeof Card>

const Template: ComponentStory<typeof Card> = (args) => {
  return (
    <Spacing direction="vertical">
      <Card {...args}>I&apos;m a card!</Card>
      <Card {...args} title="This is card title" size="md">
        I&apos;m a medium sized card!
      </Card>
      <Card {...args} title="This is card title" size="lg" extra="399 SEK/mth">
        I&apos;m a large card with extra content
      </Card>
    </Spacing>
  )
}

export const Default = Template.bind({})
