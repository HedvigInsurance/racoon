import type { Meta, StoryObj } from '@storybook/react'
import { QuickPurchaseForm, type ProductOption } from './QuickPurchaseForm'

const meta: Meta<typeof QuickPurchaseForm> = {
  component: QuickPurchaseForm,
  title: 'Components / QuickPurchase / QuickPurchaseFormV2',
  parameters: {
    grid: { width: '1/3' },
  },
}

export default meta
type Story = StoryObj<typeof QuickPurchaseForm>

const options: Array<ProductOption> = [
  {
    name: 'Accident',
    value: 'SE_ACCIDENT',
    img: {
      src: 'https://a.storyblok.com/f/165473/832x832/d6bf60c98b/hedvig-pillow-accident.png',
    },
  },
  {
    name: 'Car',
    value: 'SE_CAR',
    img: {
      src: 'https://a.storyblok.com/f/165473/832x832/001eb5c8a1/hedvig-pillow-car.png',
    },
  },
]

export const Default: Story = {
  args: {
    productOptions: options,
    defaultValue: options[0].value,
    showSsnField: true,
  },
}

export const SingleProduct: Story = {
  args: {
    productOptions: [options[0]],
    productByline: 'Help when you need it the most',
    defaultValue: options[0].value,
    showSsnField: true,
  },
}
