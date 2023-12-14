import { type Meta, type StoryObj } from '@storybook/react'
import { Button, Heading, Text, theme } from 'ui'
import { Pillow } from '@/components/Pillow/Pillow'
import { Price } from '@/components/Price'
import { CurrencyCode } from '@/services/graphql/generated'
import { ProductUsp, QuickAddBundleView } from './QuickAddBundleView'
import { QuickAddInfoDialog } from './QuickAddInfoDialog'

const meta: Meta<typeof QuickAddBundleView> = {
  title: 'Components / Quick Add / Bundle View',
  component: QuickAddBundleView,
  parameters: { grid: { width: '1/3', align: 'center' } },
}

export default meta
type Story = StoryObj<typeof QuickAddBundleView>

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
    badge: {
      children: 'Popular',
    },
    children: (
      <>
        <Button size="medium" fullWidth={true}>
          Upgrade
        </Button>
        <QuickAddInfoDialog
          Header={
            <>
              <Pillow
                size="xlarge"
                src="https://assets.hedvig.com/f/165473/832x832/1bb4813dd1/hedvig-pillows-accident.png"
              />
              <Heading as="h1" variant="standard.18" mt={theme.space.md}>
                Accident insurance
              </Heading>
              <Price
                color="textTranslucentSecondary"
                amount={100}
                currencyCode={CurrencyCode.Sek}
              />
            </>
          }
        >
          <Text align="center">Perils here</Text>
        </QuickAddInfoDialog>
      </>
    ),
  },
}
