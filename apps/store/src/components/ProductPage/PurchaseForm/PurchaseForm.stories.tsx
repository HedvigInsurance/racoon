import { Meta, StoryObj } from '@storybook/react'
import { ProductDataProvider } from '@/components/ProductData/ProductDataProvider'
import { productData } from '@/mocks/productData'
import { productStoryBRF } from '@/mocks/storyblok'
import { BankIdContextProvider } from '@/services/bankId/BankIdContext'
import { PriceIntentCreateDocument, ShopSessionCreateDocument } from '@/services/graphql/generated'
import { SE_APARTMENT_BRF } from '@/services/PriceCalculator/data/SE_APARTMENT_BRF'
import { ShopSessionProvider } from '@/services/shopSession/ShopSessionContext'
import { PriceIntentContextProvider } from '../PriceIntentContext'
import { ProductPageContextProvider } from '../ProductPageContext'
import { PurchaseForm } from './PurchaseForm'

const meta: Meta<typeof PurchaseForm> = {
  title: 'Purchase Form / Purchase Form',
}

export default meta
type Story = StoryObj<typeof PurchaseForm>

const Template: Story = {
  render: () => (
    <ShopSessionProvider shopSessionId="1e517b18-fd77-4384-aee1-17481da3781a">
      <ProductDataProvider productData={props.productData}>
        <ProductPageContextProvider priceTemplate={props.priceTemplate} story={productStoryBRF}>
          <PriceIntentContextProvider>
            <BankIdContextProvider>
              <PurchaseForm />
            </BankIdContextProvider>
          </PriceIntentContextProvider>
        </ProductPageContextProvider>
      </ProductDataProvider>
    </ShopSessionProvider>
  ),
}

const props = {
  priceTemplate: SE_APARTMENT_BRF,
  productData,
  averageRating: {
    score: 5,
    reviewCount: 1000,
  },
  reviewComments: null,
  trustpilot: null,
}

export const Default: Story = {
  ...Template,
  parameters: {
    apolloClient: {
      mocks: [
        {
          request: {
            query: ShopSessionCreateDocument,
            variables: {
              countryCode: 'SE',
            },
          },
          result: {
            data: {
              shopSessionCreate: {
                id: 'e19a94ed-9abe-4493-b678-abe8c71683e3',
                countryCode: 'SE',
                currencyCode: 'SEK',
                customer: null,
                cart: {
                  id: '9c21e9ca-9309-4817-8609-fcb7fb951b10',
                  campaignsEnabled: true,
                  cost: {
                    gross: {
                      amount: 0.0,
                      currencyCode: 'SEK',
                      __typename: 'Money',
                    },
                    net: {
                      amount: 0.0,
                      currencyCode: 'SEK',
                      __typename: 'Money',
                    },
                    discount: {
                      amount: 0.0,
                      currencyCode: 'SEK',
                      __typename: 'Money',
                    },
                    __typename: 'CartCost',
                  },
                  redeemedCampaign: null,
                  entries: [],
                  __typename: 'Cart',
                },
                __typename: 'ShopSession',
              },
            },
          },
        },
        {
          request: {
            query: PriceIntentCreateDocument,
            variables: {
              productName: 'SE_APARTMENT_BRF',
              shopSessionId: 'e19a94ed-9abe-4493-b678-abe8c71683e3',
            },
          },
          result: {
            data: {
              priceIntentCreate: {
                id: '2b4fd056-c572-42cc-815c-68f6bfcc65e5',
                data: {},
                suggestedData: {},
                offers: [],
                externalInsurer: null,
                product: {
                  name: 'SE_APARTMENT_BRF',
                  displayNameShort: 'Homeowner',
                  pageLink: '/se-en/insurances/home-insurance/homeowner',
                  __typename: 'Product',
                },
                insurely: {
                  configName: 'hedvig-test',
                  partner: 'HEDVIG_HOME',
                  __typename: 'PriceIntentInsurely',
                },
                __typename: 'PriceIntent',
              },
            },
          },
        },
      ],
    },
  },
}
