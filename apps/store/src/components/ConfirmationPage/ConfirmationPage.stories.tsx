import { ComponentMeta } from '@storybook/react'
import { CurrencyCode, ExternalInsuranceCancellationOption } from '@/services/apollo/generated'
import { ConfirmationPage } from './ConfirmationPage'

export default {
  title: 'ConfirmationPage',
  component: ConfirmationPage,
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof ConfirmationPage>

export const Default = () => {
  return (
    <ConfirmationPage
      globalStory={{
        ...storyblokStory,
        content: {
          header: [],
          footer: [],
        },
      }}
      currency="SEK"
      platform="apple"
      cart={{
        id: '123',
        cost: {
          gross: { amount: 225, currencyCode: CurrencyCode.Sek },
          net: { amount: 215, currencyCode: CurrencyCode.Sek },
          discount: { amount: 10, currencyCode: CurrencyCode.Sek },
        },
        redeemedCampaigns: [],
        entries: [
          {
            id: '123',
            startDate: '2023-02-24',
            priceIntentData: {},
            variant: {
              typeOfContract: 'SE_APARTMENT_BRF',
              displayName: 'Hedvig BRF',
              product: {
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
            },
          },
        ],
      }}
      // TODO: get this from some fixture module
      story={{
        ...storyblokStory,
        content: {
          body: [],
          title: 'Your purchase is complete!',
          subtitle: 'A confirmation has been sent via email.',
          footerTitle: 'Do you still need help?',
          footerSubtitle:
            'Download the Hedvig app and contact us in the chat and we will help you.',
          footerImage: {
            id: 6967517,
            alt: '',
            name: '',
            focus: '',
            title: '',
            filename:
              'https://a.storyblok.com/f/165473/2160x1549/7784154280/phone_heldnatural_en-1.png',
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
        },
      }}
    />
  )
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
