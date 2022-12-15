import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { ComponentMeta } from '@storybook/react'
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
} as ComponentMeta<typeof CartCollapsible>

export const Default = () => (
  <CartCollapsible title="3 insurances" cost={{ amount: 234, currencyCode: 'SEK' }}>
    I am inside the collapsible
  </CartCollapsible>
)
