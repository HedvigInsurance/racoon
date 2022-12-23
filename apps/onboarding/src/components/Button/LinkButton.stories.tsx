import { Meta, Story } from '@storybook/react'
import { LinkButton, LinkButtonProps } from './Button'

const storyMeta: Meta<LinkButtonProps> = {
  title: 'Button / Link Button',
  component: LinkButton,
}

export default storyMeta

type Template = Story<LinkButtonProps>

const DefaultTemplate: Template = (args: LinkButtonProps) => {
  return <LinkButton {...args}>{args.children}</LinkButton>
}

export const Default = DefaultTemplate.bind({})
Default.args = { as: 'a', children: 'Hello', href: 'https://google.com' }
