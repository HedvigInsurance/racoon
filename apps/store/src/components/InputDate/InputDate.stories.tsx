import type { StoryObj, Meta } from '@storybook/react'
import { InputDate } from '@/components/InputDate/InputDate'

const todayAsIsoString = () => new Date().toISOString().split('T')[0]

const meta: Meta<typeof InputDate> = {
  title: 'Inputs / Date',
  component: InputDate,
  args: {
    label: 'Date input',
    defaultValue: todayAsIsoString(),
  },
  argTypes: { onChange: { action: 'change' } },
  parameters: { grid: { width: '1/3' } },
}

export default meta
type Story = StoryObj<typeof InputDate>

export const Default: Story = {}

export const MinMaxLimits: Story = {
  args: {
    ...meta.args,
    min: todayAsIsoString(),
    max: (() => {
      const defaultMax = new Date()
      defaultMax.setDate(90)
      return defaultMax.toISOString().split('T')[0]
    })(),
  },
}
