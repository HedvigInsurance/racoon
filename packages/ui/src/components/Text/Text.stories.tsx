import { Meta, StoryFn } from '@storybook/react'
import { Text, TextProps } from './Text'

export default {
  title: 'Text',
  component: Text,
  parameters: {
    backgrounds: {
      default: 'Light',
    },
  },
  args: {
    children: 'This is a Text',
  },
} as Meta<typeof Text>

const Template: StoryFn<TextProps> = ({ children, ...rest }) => <Text {...rest}>{children}</Text>

export const SingleSize = Template.bind({})
SingleSize.args = { color: 'textPrimary', size: 'lg' }

export const ResponsiveSize = Template.bind({})
ResponsiveSize.args = { color: 'textPrimary', size: { _: 'sm', md: 'lg', lg: 'xxl' } }
