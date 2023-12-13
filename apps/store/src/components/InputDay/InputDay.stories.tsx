import type { Meta, StoryObj } from '@storybook/react'
import { InputDay } from './InputDay'

const meta: Meta<typeof InputDay> = {
  title: 'Inputs / Day',
  component: InputDay,
  args: {
    label: 'Date input',
  },
  argTypes: { onSelect: { action: 'select' } },
  parameters: { grid: { width: '1/3' } },
}
export default meta

type Story = StoryObj<typeof InputDay>

export const DayPicker: Story = {
  args: { fromDate: new Date() },
}

export const BirthDayPicker: Story = {
  args: { fromDate: new Date('1990-01-01'), toDate: new Date() },
}

export const Disabled: Story = {
  args: { disabled: true, selected: new Date() },
}
