import { Meta, StoryFn } from '@storybook/react'
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
}
export default meta

export const Default: StoryFn<typeof InputDate> = (props) => {
  return <InputDate {...props} />
}

export const MinValue = Default
MinValue.args = {
  ...meta.args,
  min: todayAsIsoString(),
}
