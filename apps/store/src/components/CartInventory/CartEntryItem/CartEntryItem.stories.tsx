import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import type { Meta, StoryObj } from '@storybook/react'
import { CurrencyCode, InsuranceDocumentType } from '@/services/apollo/generated'
import { AppErrorProvider } from '@/services/appErrors/AppErrorContext'
import { ShopSessionProvider } from '@/services/shopSession/ShopSessionContext'
import { CartEntryItem } from './CartEntryItem'

const meta: Meta<typeof CartEntryItem> = {
  title: 'Cart / CartEntryItem',
  component: CartEntryItem,
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
      defaultViewport: 'iphonese2',
    },
  },
}

export default meta
type Story = StoryObj<typeof CartEntryItem>

const Template: Story = {
  render: (args) => (
    <ShopSessionProvider shopSessionId="1e517b18-fd77-4384-aee1-17481da3781a">
      <AppErrorProvider>
        <div style={{ maxWidth: '29rem', width: '100%' }}>
          <CartEntryItem {...args} />
        </div>
      </AppErrorProvider>
    </ShopSessionProvider>
  ),
}

export const ReadOnly = {
  ...Template,
  args: {
    readOnly: true,
    cartId: 'cart',
    offerId: '123',
    title: 'Accident insurance',
    productName: 'SE_ACCIDENT',
    cost: {
      amount: 129,
      currencyCode: CurrencyCode.Sek,
    },
    pillow: {
      src: 'https://a.storyblok.com/f/165473/832x832/d6bf60c98b/hedvig-pillow-accident.png',
      alt: '',
    },
    startDate: new Date(),
    documents: [
      {
        type: InsuranceDocumentType.GeneralTerms,
        displayName: 'Olycksfall Försäkringsvillkor',
        url: 'https://promise.hedvig.com/swe_terms_conditions_accident_47228b7079.pdf',
      },
      {
        type: InsuranceDocumentType.PreSaleInfo,
        displayName: 'Produktfaktablad Olycksfallsförsäkring',
        url: 'https://promise.hedvig.com/Hedvig_OLYCKSFALL_SE_IPID_1_7e7640efa2.pdf',
      },
      {
        type: InsuranceDocumentType.TermsAndConditions,
        displayName: 'Olycksfallsförsäkring Ärrtabell',
        url: 'https://promise.hedvig.com/se_arrtabell_olycksfall_66dbff4975.pdf',
      },
    ],
    data: {
      street: 'Kyrkängesvägen 3 D 1tr',
      zipCode: '83798',
      livingSpace: 70,
      numberCoInsured: '2',
    },
  },
}

export const Editable = {
  ...Template,
  args: {
    ...ReadOnly.args,
    readOnly: false,
  },
}
