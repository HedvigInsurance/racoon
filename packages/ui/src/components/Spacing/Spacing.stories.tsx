import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Card } from '../Card/Card'
import { Spacing } from './Spacing'

export default {
  title: 'UI / Spacing',
  component: Spacing,
  parameters: {
    docs: {
      description: {
        component:
          'Utility component to easily add vertical or horizontal space between components',
      },
    },
  },
  args: {
    direction: 'horizontal',
  },
  argTypes: {
    theme: { table: { disable: true } },
    as: { table: { disable: true } },
  },
} as ComponentMeta<typeof Spacing>

const Template: ComponentStory<typeof Spacing> = (args) => {
  return (
    <Spacing {...args}>
      <Card>I&apos;m a card</Card>
      <Card>I&apos;m also a card</Card>
      <Card>
        <p>I&apos;m a card</p>
        <p>with more content</p>
      </Card>
    </Spacing>
  )
}

export const Default = Template.bind({})
Default.args = {}
