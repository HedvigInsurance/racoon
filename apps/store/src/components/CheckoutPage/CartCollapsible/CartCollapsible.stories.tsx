import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { Meta } from '@storybook/react'
import { CurrencyCode } from '@/services/apollo/generated'
import { CartCollapsible } from './CartCollapsible'

export default {
  title: 'Checkout / Cart Collapsible',
  component: CartCollapsible,
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
      defaultViewport: 'iphonese2',
    },
  },
} as Meta<typeof CartCollapsible>

export const Default = () => (
  <CartCollapsible
    title="3 insurances"
    cost={{ total: { amount: 234, currencyCode: CurrencyCode.Sek } }}
  >
    I am inside the collapsible
  </CartCollapsible>
)
