import type { Meta } from '@storybook/react'
import * as InputRadio from './InputRadio'

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

export const Horizontal = () => (
  <InputRadio.HorizontalRoot label="Horizontal">
    <InputRadio.HorizontalItem value="1" label="Option 1" />
    <InputRadio.HorizontalItem value="2" label="Option 2" />
  </InputRadio.HorizontalRoot>
)

export const Vertical = () => (
  <InputRadio.Root label="Vertical">
    <InputRadio.Item value="1" label="Option 1" />
    <InputRadio.Item value="2" label="Option 2" />
  </InputRadio.Root>
)
