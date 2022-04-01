import { Meta, Story } from '@storybook/react'
import { MailIcon } from '../../icons/MailIcon'
import { Button, ButtonProps } from './button'

type StoryProps = ButtonProps & { disabled: boolean }

const storyMeta: Meta<StoryProps> = {
  title: 'Button',
  component: Button,
  args: {
    $color: 'lavender',
    $hasFullWidth: false,
    $variant: 'filled',
    disabled: false,
  },
  parameters: {
    backgrounds: {
      default: 'gray100',
    },
  },
}

export default storyMeta

type Template = Story<StoryProps>

const Template: Template = ({ children, ...args }) => <Button {...args}>{children}</Button>

export const Default = Template.bind({})
Default.args = { children: 'Hello' }

export const WithIcon = Template.bind({})
WithIcon.args = { icon: <MailIcon />, children: 'Send email' }

export const OnlyIcon = Template.bind({})
OnlyIcon.args = { icon: <MailIcon /> }

const TemplateManyButtons: Template = ({ children, ...args }) => (
  <>
    <Button {...args}>{children}</Button>
    <Button {...args}>{children}</Button>
  </>
)

export const TwoButtons = TemplateManyButtons.bind({}).bind({})
TwoButtons.args = { icon: <MailIcon />, children: 'Send email' }
