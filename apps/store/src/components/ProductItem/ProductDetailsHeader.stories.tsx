import { type Meta, type StoryObj } from '@storybook/react'
import { CurrencyCode } from '@/services/apollo/generated'
import { ProductDetailsHeader } from './ProductDetailsHeader'

const meta: Meta<typeof ProductDetailsHeader> = {
  title: 'Components / Product Item / Product Details Header',
  component: ProductDetailsHeader,
  parameters: { grid: { width: '1/3' } },
}

export default meta
type Story = StoryObj<typeof ProductDetailsHeader>

export const Collapsed: Story = {
  args: {
    price: {
      currencyCode: CurrencyCode.Sek,
      amount: 100,
    },
    expanded: false,
  },
}

export const Expanded: Story = {
  args: {
    ...Collapsed.args,
    expanded: true,
  },
}

export const WithReducedPrice: Story = {
  args: {
    ...Collapsed.args,
    price: {
      currencyCode: CurrencyCode.Sek,
      amount: 100,
      reducedAmount: 50,
    },
  },
}
