import { Meta, StoryFn } from '@storybook/react'
import { CurrencyCode, ExternalInsuranceCancellationOption } from '@/services/apollo/generated'
import { AppErrorProvider } from '@/services/appErrors/AppErrorContext'
import { ConfirmationStory } from '@/services/storyblok/storyblok'
import { ConfirmationPage } from './ConfirmationPage'

type StoryArgs = { sas: boolean }

const meta: Meta<StoryArgs> = {
  title: 'Checkout / ConfirmationPage',
  args: {
    sas: false,
  },
  argTypes: {
    sas: {
      name: 'SAS Eurobonus eligible?',
      type: 'boolean',
    },
  },
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta

export const Default: StoryFn<StoryArgs> = (args) => {
  const memberPartnerData = args.sas ? { sas: { eligible: true } } : null
  return (
    <AppErrorProvider>
      <ConfirmationPage
        globalStory={{
          ...storyblokStory,
          content: {
            header: [],
            footer: [],
          },
        }}
        shopSessionId="aiwdoiaiojoiwa"
        memberPartnerData={memberPartnerData}
        currency="SEK"
        cart={cart}
        story={story}
      />
    </AppErrorProvider>
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
      cost: {
        gross: {
          amount: 125,
          currencyCode: CurrencyCode.Sek,
        },
        net: {
          amount: 125,
          currencyCode: CurrencyCode.Sek,
        },
        discount: {
          amount: 0,
          currencyCode: CurrencyCode.Sek,
        },
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
