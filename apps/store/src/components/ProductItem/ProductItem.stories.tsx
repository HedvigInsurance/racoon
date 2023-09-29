import { type Meta, type StoryObj } from '@storybook/react'
import { LockIcon, theme } from 'ui'
import { CurrencyCode } from '@/services/apollo/generated'
import { ActionButton, ProductItem } from './ProductItem'

const meta: Meta<typeof ProductItem> = {
  title: 'Components / Product Item',
  component: ProductItem,
  argTypes: {
    startDate: { control: { disable: true } },
  },
}

export default meta
type Story = StoryObj<typeof ProductItem>

export const Default: Story = {
  args: {
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
        <ActionButton onClick={() => console.log('clicked')}>Edit</ActionButton>
        <ActionButton onClick={() => console.log('clicked')}>Remove</ActionButton>
      </>
    ),
  },
}

export const WithoutChildren: Story = {
  args: {
    ...Default.args,
    children: undefined,
  },
}

export const ActiveContract: Story = {
  args: {
    ...Default.args,
    title: 'Trial 2 months',
    startDate: {
      label: 'Full insurance until 02.12.24',
      tooltip: 'You need to sign a new insurance before this date.',
    },
    Icon: <LockIcon color={theme.colors.textTranslucentSecondary} />,
    subtitle: 'Hedvigsgatan 12 · 2 people',
    children: undefined,
  },
}

export const WithSubtitle: Story = {
  args: {
    ...Default.args,
    subtitle: 'Hedvigsgatan 12 · 2 people',
  },
}

export const Green: Story = {
  args: {
    ...Default.args,
    variant: 'green',
    defaultExpanded: true,
  },
}
