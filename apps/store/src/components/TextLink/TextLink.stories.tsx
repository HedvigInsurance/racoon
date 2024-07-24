import { type Meta, type StoryObj } from '@storybook/react'
import { type ComponentProps } from 'react'
import { TextLink } from '@/components/TextLink/TextLink'

const meta: Meta<typeof TextLink> = {
  component: TextLink,
  render: Template,
}

export default meta

type Story = StoryObj<typeof TextLink>

function Template(props: ComponentProps<typeof TextLink>) {
  return (
    <div>
      <TextLink {...props} />
    </div>
  )
}

export const Default: Story = {
  args: {
    children: 'Hello, world!',
    href: 'https://dev.hedvigit.com',
    target: '_blank',
  },
}
export const Small: Story = {
  args: {
    children: 'Hello, world!',
    href: 'https://dev.hedvigit.com',
    target: '_blank',
    size: 'sm',
  },
}
export const Secondary: Story = {
  args: {
    children: 'Hello, world!',
    href: 'https://dev.hedvigit.com',
    target: '_blank',
    color: 'textSecondary',
  },
}
