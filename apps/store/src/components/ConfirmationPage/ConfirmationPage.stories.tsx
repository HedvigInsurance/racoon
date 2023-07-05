import { Meta, StoryObj } from '@storybook/react'
import { CurrencyCode, ExternalInsuranceCancellationOption } from '@/services/apollo/generated'
import { ShopSessionOutcomeDocument } from '@/services/apollo/generated'
import { AppErrorProvider } from '@/services/appErrors/AppErrorContext'
import { ConfirmationStory } from '@/services/storyblok/storyblok'
import { ConfirmationPage } from './ConfirmationPage'

const meta: Meta<typeof ConfirmationPage> = {
  title: 'Checkout / ConfirmationPage',
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof ConfirmationPage>

const Template: Story = {
  render: (args) => (
    <AppErrorProvider>
      <ConfirmationPage {...args} />
    </AppErrorProvider>
  ),
}

const storyblokStory = {
  id: 123,
  alternates: [],
  full_slug: 'confirmation-page',
  created_at: '2021-03-02T10:00:00.000Z',
  group_id: '123',
  is_startpage: false,
  name: 'Confirmation page',
  parent_id: 123,
  position: 0,
  published_at: '2021-03-02T10:00:00.000Z',
  first_published_at: '2021-03-02T10:00:00.000Z',
  meta_data: {},
  slug: 'confirmation-page',
  lang: 'en',
  uuid: '123',
  sort_by_date: '2021-03-02T10:00:00.000Z',
  tag_list: [],
}

const cart = {
  id: '123',
  cost: {
    gross: { amount: 225, currencyCode: CurrencyCode.Sek },
    net: { amount: 215, currencyCode: CurrencyCode.Sek },
    discount: { amount: 10, currencyCode: CurrencyCode.Sek },
  },
  redeemedCampaigns: [],
  campaignsEnabled: true,
  entries: [
    {
      id: '123',
      startDate: '2023-02-24',
      priceIntentData: {},
      variant: {
        typeOfContract: 'SE_APARTMENT_BRF',
        displayName: 'Hedvig BRF',
        product: {
          id: 'oidajwoijawd',
          name: 'SE_APARTMENT_BRF',
          displayNameFull: 'Home Insurance Homeowner',
          pillowImage: {
            id: '6646216',
            alt: '',
            src: 'https://a.storyblok.com/f/165473/512x512/7996914970/se-apartment-rental.png',
          },
        },
        perils: [],
        documents: [],
      },
      price: {
        amount: 125,
        currencyCode: CurrencyCode.Sek,
      },
      cancellation: {
        option: ExternalInsuranceCancellationOption.None,
        requested: false,
        bankSigneringApproveByDate: null,
      },
    },
  ],
}

// TODO: get this from some fixture module
const story: ConfirmationStory = {
  ...storyblokStory,
  content: {
    body: [],
    title: 'Your purchase is complete!',
    subtitle: 'A confirmation has been sent via email.',
    footerTitle: 'Do you still need help?',
    footerSubtitle: 'Download the Hedvig app and contact us in the chat and we will help you.',
    footerImage: {
      id: 6967517,
      alt: '',
      name: '',
      focus: '',
      title: '',
      filename: 'https://a.storyblok.com/f/165473/2160x1549/7784154280/phone_heldnatural_en-1.png',
      copyright: '',
      fieldtype: 'asset',
      is_external_url: false,
    },
    checklistTitle: 'What happens next?',
    checklistSubtitle: 'We will send you a confirmation via email.',
    checklist: `Sign Hedvig
          Connect payment method
          Download the app`,
    faqTitle: 'Frequently asked questions',
    faqSubtitle: 'Here are some answers to the most common questions.',
    seoTitle: 'Your purchase is complete | Hedvig',
  },
}

export const Default = {
  ...Template,
  args: {
    globalStory: {
      ...storyblokStory,
      content: {
        header: [],
        footer: [],
      },
    },
    shopSessionId: 'ecf94a27-9daa-460e-a272-48b60f2d74ec',
    memberPartnerData: { sas: { eligible: true } },
    currency: 'SEK',
    cart: cart,
    story: story,
  },
}

export const WithSwitchingAssistant = {
  ...Template,
  args: {
    ...Default.args,
    switching: {
      companyDisplayName: 'ICA FÖRSÄKRING',
    },
  },
  parameters: {
    apolloClient: {
      mocks: [
        {
          request: {
            query: ShopSessionOutcomeDocument,
            variables: {
              shopSessionId: 'ecf94a27-9daa-460e-a272-48b60f2d74ec',
            },
          },
          result: {
            data: {
              shopSession: {
                id: 'ecf94a27-9daa-460e-a272-48b60f2d74ec',
                outcome: {
                  id: 'd17845cb-16f3-4318-909e-e73888e1ef09',
                  createdContracts: [
                    {
                      id: '11f48e7e-62de-4fdc-ac3b-6863a908c58f',
                      variant: {
                        displayName: 'Full coverage',
                        __typename: 'ProductVariant',
                      },
                      externalInsuranceCancellation: {
                        id: '9f015c25-b8bf-4da2-afab-077f2b2f28a1',
                        status: 'NOT_INITIATED',
                        externalInsurer: {
                          id: 'ICA FÖRSÄKRING',
                          displayName: 'ICA FÖRSÄKRING',
                          __typename: 'ExternalInsurer',
                        },
                        bankSignering: {
                          approveByDate: '2023-07-24',
                          url: null,
                          __typename: 'ContractBankSigneringCancellation',
                        },
                        __typename: 'ContractExternalInsuranceCancellation',
                      },
                      __typename: 'Contract',
                    },
                  ],
                  __typename: 'ShopSessionOutcome',
                },
                __typename: 'ShopSession',
              },
            },
          },
        },
      ],
    },
  },
}
