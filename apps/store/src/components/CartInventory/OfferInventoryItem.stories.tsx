import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { CurrencyCode, ProductOfferFragment } from '@/services/apollo/generated'
import { OfferInventoryItem } from './OfferInventoryItem'

const MOCK_OFFER: ProductOfferFragment = {
  id: 'a98c1fe0-a216-412d-8664-fe130daec0f8',
  variant: {
    typeOfContract: 'SE_APARTMENT_RENT',
    displayName: '◰ Hem',
  },
  price: {
    amount: 109,
    currencyCode: CurrencyCode.Sek,
  },
  startDate: '2022-10-26',
}

export default {
  title: 'Offer Inventory Item',
  component: OfferInventoryItem,
  argTypes: {
    onRemove: { action: 'clicked' },
  },
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
      defaultViewport: 'iphonese2',
    },
  },
} as ComponentMeta<typeof OfferInventoryItem>

const Template: ComponentStory<typeof OfferInventoryItem> = (props) => {
  return <OfferInventoryItem {...props} />
}

export const Default = Template.bind({})
Default.args = {
  offer: MOCK_OFFER,
}

export const WithoutRemove = Template.bind({})
WithoutRemove.args = {
  onRemove: undefined,
  offer: MOCK_OFFER,
}
