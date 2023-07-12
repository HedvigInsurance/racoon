import { Meta, StoryObj } from '@storybook/react'
import { Button, theme } from 'ui'
import { CurrencyCode, InsuranceDocumentType } from '@/services/apollo/generated'
import { CartItem } from './CartItem'

const meta: Meta<typeof CartItem> = {
  title: 'Components / Cart Item',
  component: CartItem,
}

type Story = StoryObj<typeof CartItem>

export const ReadOnly: Story = {
  args: {
    displayName: 'Homeowner Insurance',
    pillow: {
      src: 'https://a.storyblok.com/f/165473/832x832/f98d88ac63/hedvig-pillows-homeowner.png',
    },
    productName: 'SE_APARTMENT_BRF',
    cost: {
      gross: { amount: 100, currencyCode: CurrencyCode.Sek },
      net: { amount: 100, currencyCode: CurrencyCode.Sek },
      discount: { amount: 0, currencyCode: CurrencyCode.Sek },
    },
    documents: [
      {
        type: InsuranceDocumentType.GeneralTerms,
        url: 'https://www.hedvig.com/terms',
        displayName: 'Insurance terms',
      },
    ],
    data: {
      street: 'Kungsgatan 1',
      zipCode: '111 22',
    },
    startDate: new Date(),
    defaultExpanded: false,
  },
}

export const Expanded: Story = {
  args: {
    ...ReadOnly.args,
    defaultExpanded: true,
  },
}

export const WithActions: Story = {
  args: {
    ...ReadOnly.args,
    children: (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: theme.space.xs,
        }}
      >
        <Button variant="secondary-alt" size="medium">
          Edit
        </Button>

        <Button variant="secondary-alt" size="medium">
          Remove
        </Button>
      </div>
    ),
  },
}

export const WithDiscount: Story = {
  args: {
    ...ReadOnly.args,
    cost: {
      gross: { amount: 100, currencyCode: CurrencyCode.Sek },
      net: { amount: 90, currencyCode: CurrencyCode.Sek },
      discount: { amount: 10, currencyCode: CurrencyCode.Sek },
    },
  },
}

export const WithCancellation: Story = {
  args: {
    ...ReadOnly.args,
    startDate: undefined,
  },
}

export default meta
