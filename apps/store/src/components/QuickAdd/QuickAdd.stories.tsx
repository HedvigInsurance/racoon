import { type Meta, type StoryObj } from '@storybook/react'
import { Button, Text } from 'ui'
import { StartDate } from '@/components/ProductItem/StartDate'
import { CurrencyCode } from '@/services/apollo/generated'
import { ProductDetail, ProductUsp, QuickAdd } from './QuickAdd'

const meta: Meta<typeof QuickAdd> = {
  title: 'Components / Quick Add',
  component: QuickAdd,
  parameters: { grid: { width: '1/3' } },
}

export default meta
type Story = StoryObj<typeof QuickAdd>

export const Default: Story = {
  args: {
    title: 'Home + Accident',
    subtitle: 'Covers 2 people',
    pillow: {
      src: 'https://assets.hedvig.com/f/165473/832x832/1bb4813dd1/hedvig-pillows-accident.png',
    },
    mainOfferPillow: {
      src: 'https://assets.hedvig.com/f/165473/832x832/cdaaa91242/hedvig-pillows-home.png',
    },
    href: '/se',
    price: {
      currencyCode: CurrencyCode.Sek,
      amount: 99,
    },
    Body: (
      <Text as="p" color="textTranslucentSecondary">
        Få upp till 1 miljon kronor i ersättning för skador och förlorad arbetsförmåga vid olycka.
        Ingen självrisk.
      </Text>
    ),
    badge: {
      children: 'Popular',
    },
    children: (
      <>
        <Button size="medium" fullWidth={true}>
          Upgrade
        </Button>
        <Button size="medium" variant="ghost" fullWidth={true}>
          {"See what's included"}
        </Button>
      </>
    ),
  },
}

export const WithUsps: Story = {
  args: {
    ...Default.args,
    Body: (
      <>
        <Text as="p" color="textTranslucentSecondary">
          Increase your coverage with our accident insurance. Get compensation for dental, scars and
          much more.
        </Text>
        <ul>
          <ProductUsp>Extra coverage for injuries and accidents</ProductUsp>
          <ProductUsp>Up to 1 000 000kr in compensation</ProductUsp>
          <ProductUsp>No deductible</ProductUsp>
        </ul>
      </>
    ),
  },
}

export const WithDiscount: Story = {
  args: {
    ...Default.args,
    price: {
      currencyCode: CurrencyCode.Sek,
      amount: 99,
      reducedAmount: 49,
    },
  },
}

export const Loading: Story = {
  args: {
    ...Default.args,
    children: (
      <>
        <Button size="medium" loading={true}>
          Upgrade
        </Button>
        <Button size="medium" variant="ghost">
          {"See what's included"}
        </Button>
      </>
    ),
  },
}

export const Complete: Story = {
  args: {
    ...Default.args,
    Body: (
      <ul>
        <ProductDetail value="Folksam">Insurance company</ProductDetail>
        <ProductDetail value="AHK 234">License</ProductDetail>
        <ProductDetail value="1000 km/year">Milage</ProductDetail>
        <ProductDetail value="Full insurance">Tier</ProductDetail>
        <ProductDetail value="2024.04.24">
          <StartDate label="Activates" tooltip="Some explanation here." />
        </ProductDetail>
      </ul>
    ),
  },
}

export const WithoutPrice: Story = {
  args: {
    ...Default.args,
    price: undefined,
  },
}
