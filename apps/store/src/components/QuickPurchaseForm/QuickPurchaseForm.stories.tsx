import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import type { Meta, StoryObj } from '@storybook/react'
import { QuickPurchaseForm, type ProductOption } from './QuickPurchaseForm'

const meta: Meta<typeof QuickPurchaseForm> = {
  component: QuickPurchaseForm,
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
      defaultViewport: 'iphonese2',
    },
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
  },
}
