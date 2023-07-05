import { Meta, StoryFn } from '@storybook/react'
import { InputField } from './InputField'

export default {
  title: 'Input Field',
  component: InputField,
  argTypes: {
    placeholder: { control: 'text', defaultValue: '7VEKCAG' },
    backgroundColor: { control: 'color' },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    infoMessage: { control: 'text' },
    errorMessage: { control: 'text' },
  },
} as Meta<typeof InputField>

const Template: StoryFn<typeof InputField> = (args) => <InputField {...args} />

export const Primary = Template.bind({})
Primary.args = { label: 'Enter your code' }

export const Disabled = Template.bind({})
Disabled.args = {
  label: 'Enter your code',
  disabled: true,
}

export const WithErrorMessage = Template.bind({})
WithErrorMessage.args = {
  label: 'Enter your code',
  errorMessage: 'Invalid code',
}

export const WithInfoMessage = Template.bind({})
WithInfoMessage.args = {
  label: 'Enter your code',
  infoMessage: 'This is an info message',
}

export const WithoutLabel = Template.bind({})
WithoutLabel.args = {}
