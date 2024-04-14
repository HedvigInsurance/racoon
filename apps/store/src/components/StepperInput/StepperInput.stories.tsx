import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import type { Meta, StoryObj } from '@storybook/react'
import { StepperInput } from './StepperInput'

const meta: Meta<typeof StepperInput> = {
  title: 'Inputs / Stepper Input',
  component: StepperInput,
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
      defaultViewport: 'iphonese2',
    },
    grid: { width: '1/3' },
  },
}

export default meta
type Story = StoryObj<typeof StepperInput>

export const Default: Story = {
  args: {
    name: 'numberCoInsured',
    max: 5,
    optionLabel(count: number) {
      return `${count} person${count === 1 ? '' : 's'}`
    },
  },
}

export const WithLabel: Story = {
  args: {
    ...Default.args,
    label: 'Insured people',
  },
}
