import { type Meta, type StoryObj } from '@storybook/react'
import { Divider } from 'ui'
import { ActionButton, ProductItem } from '@/components/ProductItem/ProductItem'
import { CurrencyCode } from '@/services/graphql/generated'
import { DiscountField } from './DiscountField'
import { ShopBreakdown } from './ShopBreakdown'
import { TotalAmount } from './TotalAmount'

const meta: Meta<typeof ShopBreakdown> = {
  title: 'Components / Shop Breakdown',
  component: ShopBreakdown,
  argTypes: {
    children: {
      control: {
        disable: true,
      },
    },
  },
  parameters: { grid: { width: '1/3' } },
}

export default meta
type Story = StoryObj<typeof ShopBreakdown>

const PRODUCT_ITEM = {
  pillowSrc: 'https://placekitten.com/200/300',
  title: 'Hemförsäkring Bostadsrätt',
  startDate: {
    label: 'Activated on 02.12.24',
    tooltip: 'You can change the start date of your insurance in the app',
  },
  price: {
    currencyCode: CurrencyCode.Sek,
    amount: 100,
  },
  productDetails: [
    { title: 'Försäkringsnummer', value: '123456789' },
    { title: 'Försäkringsperiod', value: '02.12.24 - 02.12.25' },
    { title: 'Premie', value: '100 kr/mån' },
  ],
  productDocuments: [
    {
      title: 'Försäkringsvillkor',
      url: 'https://www.hedvig.com/se/forsakringar/hemforsakring/villkor',
    },
    {
      title: 'Försäkringsbrev',
      url: 'https://www.hedvig.com/se/forsakringar/hemforsakring/brev',
    },
  ],
  children: (
    <>
      <ActionButton>Edit</ActionButton>
      <ActionButton>Remove</ActionButton>
    </>
  ),
}

export const Default: Story = {
  args: {
    children: (
      <>
        <ProductItem {...PRODUCT_ITEM} />
        <ProductItem {...PRODUCT_ITEM} />
        <DiscountField
          onAdd={() => console.log('added')}
          loadingAdd={false}
          onRemove={() => console.log('removed')}
          loadingRemove={false}
        />
        <Divider />
        <TotalAmount currencyCode={CurrencyCode.Sek} amount={200} />
      </>
    ),
  },
}
