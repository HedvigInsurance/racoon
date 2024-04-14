import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import type { Meta, StoryObj } from '@storybook/react'
import { PersonalNumberField } from './PersonalNumberField'

const meta: Meta<typeof PersonalNumberField> = {
  title: 'Inputs/PersonalNumberField',
  component: PersonalNumberField,
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
      defaultViewport: 'iphonese2',
    },
    grid: { width: '1/3' },
  },
  argTypes: { onClear: { action: 'cleared' } },
}

export default meta
type Story = StoryObj<typeof PersonalNumberField>

export const Default: Story = {
  args: {
    label: 'ÅÅÅÅMMDDXXXX',
  },
}
