import type { Meta } from '@storybook/react'
import { InputRadio, HorizontalInputRadio } from './InputRadio'

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

export const HorizontalWithLabel = () => (
  <InputRadio
    label="Label"
    options={[
      { label: 'Option 1', value: '1' },
      { label: 'Option 2', value: '2' },
    ]}
  />
)

export const HorizontalWithoutLabel = () => (
  <HorizontalInputRadio
    label="Horizontal"
    options={[
      { label: 'Option 1', value: '1' },
      { label: 'Option 2', value: '2' },
    ]}
  />
)
