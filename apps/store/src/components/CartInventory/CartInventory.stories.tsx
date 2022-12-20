import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import {
  CampaignDiscountType,
  CartFragmentFragment,
  CurrencyCode,
  ExternalInsuranceCancellationOption,
} from '@/services/apollo/generated'
import { CartInventory } from './CartInventory'

export default {
  title: 'Cart Inventory',
  component: CartInventory,
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
      defaultViewport: 'iphonese2',
    },
  },
} as ComponentMeta<typeof CartInventory>

const Template: ComponentStory<typeof CartInventory> = () => {
  return (
    <CartInventory cart={MOCK_CART}>
      {(offer) => <div>{offer.variant.product.displayNameFull}</div>}
    </CartInventory>
  )
}

export const Default = Template.bind({})
Default.args = {}

const MOCK_CART: CartFragmentFragment = {
  id: '2184f2c1-b967-421e-877c-7c7e96173893',
  cost: {
    gross: {
      amount: 307,
      currencyCode: CurrencyCode.Sek,
      __typename: 'Money',
    },
    net: {
      amount: 307,
      currencyCode: CurrencyCode.Sek,
      __typename: 'Money',
    },
    discount: {
      amount: 10,
      currencyCode: CurrencyCode.Sek,
      __typename: 'Money',
    },
    __typename: 'CartCost',
  },
  redeemedCampaigns: [
    {
      id: 'fb6a2f59-faaa-423c-b43b-169c3c6ccf4c',
      code: 'meletis4ever',
      discount: {
        type: CampaignDiscountType.MonthlyCost,
        amount: {
          currencyCode: CurrencyCode.Sek,
          amount: 10,
          __typename: 'Money',
        },
        percentage: 0,
        months: 0,
        __typename: 'CampaignDiscount',
      },
      __typename: 'RedeemedCampaign',
    },
  ],
  entries: [
    {
      id: 'e01f57f9-37f8-4554-946b-e509233632ff',
      variant: {
        typeOfContract: 'SE_ACCIDENT',
        product: {
          displayNameFull: 'Accident Insurance',
          pillowImage: {
            id: '6646216',
            alt: '',
            src: 'https://a.storyblok.com/f/165473/512x512/7996914970/se-apartment-rental.png',
            __typename: 'StoryblokImageAsset',
          },
          __typename: 'Product',
        },
        __typename: 'ProductVariant',
      },
      price: {
        amount: 69,
        currencyCode: CurrencyCode.Sek,
        __typename: 'Money',
      },
      startDate: '2022-12-15',
      cancellation: {
        option: ExternalInsuranceCancellationOption.None,
        requested: false,
      },
      __typename: 'ProductOffer',
    },
    {
      id: '078f43ab-19fa-4007-bf64-714202bfb430',
      variant: {
        typeOfContract: 'SE_APARTMENT_RENT',
        product: {
          displayNameFull: 'Home Insurance Rental',
          pillowImage: {
            id: '6646216',
            alt: '',
            src: 'https://a.storyblok.com/f/165473/512x512/7996914970/se-apartment-rental.png',
            __typename: 'StoryblokImageAsset',
          },
          __typename: 'Product',
        },
        __typename: 'ProductVariant',
      },
      price: {
        amount: 119,
        currencyCode: CurrencyCode.Sek,
        __typename: 'Money',
      },
      startDate: '2022-12-15',
      cancellation: {
        option: ExternalInsuranceCancellationOption.None,
        requested: false,
      },
      __typename: 'ProductOffer',
    },
    {
      id: 'f13c5d6f-52ba-41db-adf3-9df196818dec',
      variant: {
        typeOfContract: 'SE_APARTMENT_RENT',
        product: {
          displayNameFull: 'Home Insurance Rental',
          pillowImage: {
            id: '6646216',
            alt: '',
            src: 'https://a.storyblok.com/f/165473/512x512/7996914970/se-apartment-rental.png',
            __typename: 'StoryblokImageAsset',
          },
          __typename: 'Product',
        },
        __typename: 'ProductVariant',
      },
      price: {
        amount: 119,
        currencyCode: CurrencyCode.Sek,
        __typename: 'Money',
      },
      startDate: '2022-12-15',
      cancellation: {
        option: ExternalInsuranceCancellationOption.None,
        requested: false,
      },
      __typename: 'ProductOffer',
    },
  ],
}
