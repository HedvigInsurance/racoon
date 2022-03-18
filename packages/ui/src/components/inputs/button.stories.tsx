import { Meta, Story } from '@storybook/react'
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

const Template: Template = (args) => <Button {...args}>Hello</Button>

export const Default = Template.bind({})
Default.args = {}
