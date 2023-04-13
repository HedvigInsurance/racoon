import { Meta, StoryFn } from '@storybook/react'
import { QuickPurchaseForm } from './QuickPurchaseForm'

export default {
  title: 'QuickPurchaseForm',
  component: QuickPurchaseForm,
} as Meta<typeof QuickPurchaseForm>

const options = [
  { name: 'Accident', value: 'SE_ACCIDENT' },
  { name: 'Car', value: 'SE_CAR' },
]

const Template: StoryFn<typeof QuickPurchaseForm> = () => {
  return <QuickPurchaseForm productOptions={options} onSubmit={(e) => e.preventDefault()} />
}

export const Default = Template.bind({})
Default.args = {}
