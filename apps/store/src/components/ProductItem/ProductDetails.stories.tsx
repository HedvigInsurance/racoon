import { type Meta, type StoryObj } from '@storybook/react'
import { ProductDetails } from './ProductDetails'

const meta: Meta<typeof ProductDetails> = {
  title: 'Components / Product Item / Product Details',
  component: ProductDetails,
  parameters: { grid: { width: '1/3' } },
}

export default meta
type Story = StoryObj<typeof ProductDetails>

export const Default: Story = {
  args: {
    items: [
      { title: 'Försäkring', value: 'Hemförsäkring Bostadsrätt' },
      { title: 'Försäkringsnummer', value: '123456789' },
      { title: 'Försäkringsperiod', value: '02.12.24 - 02.12.25' },
      { title: 'Premie', value: '100 kr/mån' },
    ],
    documents: [
      {
        title: 'Försäkringsvillkor',
        url: 'https://www.hedvig.com/se/forsakringar/hemforsakring/villkor',
      },
      {
        title: 'Försäkringsbrev',
        url: 'https://www.hedvig.com/se/forsakringar/hemforsakring/brev',
      },
    ],
  },
}
