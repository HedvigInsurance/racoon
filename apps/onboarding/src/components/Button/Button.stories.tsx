import { Meta, Story } from '@storybook/react'
import { MailIcon } from 'ui'
import { Button, ButtonProps } from './Button'

type StoryProps = ButtonProps

const storyMeta: Meta<StoryProps> = {
  title: 'Button',
  component: Button,
  args: {
    color: 'lavender',
    fullWidth: false,
    variant: 'filled',
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

export const TwoButtons = TemplateManyButtons.bind({})
TwoButtons.args = { icon: <MailIcon />, children: 'Send email' }

const TemplateFullWidth: Template = ({ children, ...args }) => (
  <div style={{ width: '512px', marginInline: 'auto' }}>
    <Button {...args}>{children}</Button>
  </div>
)
export const FullWidth = TemplateFullWidth.bind({})
FullWidth.args = { fullWidth: true, children: `I'm full width!`, icon: <MailIcon /> }
