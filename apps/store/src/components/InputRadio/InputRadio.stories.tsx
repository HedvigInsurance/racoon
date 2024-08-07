import type { Meta, StoryFn, StoryObj } from '@storybook/react'
import { InputRadio } from './InputRadio'

export default {
  title: 'Inputs / Radio',
  decorators: [
    (Story) => (
      <div style={{ width: 'min(340px, 100%)' }}>
        <Story />
      </div>
    ),
  ],
} as Meta<typeof InputRadio>

type Story = StoryObj<typeof InputRadio>

const Template: StoryFn<typeof InputRadio> = (args) => (
  <InputRadio
    {...args}
    label="Label"
    options={[
      { label: 'Yes', value: 'yes' },
      { label: 'No', value: 'no' },
    ]}
  />
)

export const HorizontalWithLabel: Story = {
  render: Template,
  args: {
    orientation: 'horizontal',
    displayLabel: true,
  },
}

export const HorizontalWithoutLabel: Story = {
  render: Template,
  args: {
    orientation: 'horizontal',
    displayLabel: false,
  },
}
