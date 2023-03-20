import { Meta, StoryFn } from '@storybook/react'
import { Space } from 'ui/src/components/Space'
import { Card, CardContent, CardMedia } from './Card'

export default {
  title: 'Card',
  component: Card,
  args: {},
} as Meta<typeof Card>

const Template: StoryFn<typeof Card> = (args) => {
  return (
    <Space y={1}>
      <Card {...args} size="sm">
        <CardContent>I&apos;m a small card!</CardContent>
      </Card>
      <Card {...args} size="md">
        <CardContent>I&apos;m a medium sized card!</CardContent>
      </Card>
      <Card {...args} size="lg">
        <CardContent>I&apos;m a large card</CardContent>
      </Card>
      <Card {...args}>
        <CardMedia
          height={140}
          image="https://source.unsplash.com/user/heytowner/?orientation=landscape"
          alt="some image description"
        />
        <CardContent>I&apos;m a large card with an image</CardContent>
      </Card>
    </Space>
  )
}

export const Default = Template.bind({})
