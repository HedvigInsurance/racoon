import { type Meta, type StoryObj } from '@storybook/react'
import { sprinkles } from 'ui/src/theme/sprinkles.css'
import { Button, Heading, Text } from 'ui'
import { Perils } from '@/components/Perils/Perils'
import { Pillow } from '@/components/Pillow/Pillow'
import { Price } from '@/components/Price'
import type { PerilFragment } from '@/services/graphql/generated'
import { CurrencyCode } from '@/services/graphql/generated'
import { ProductUsp } from './ProductUsp'
import { QuickAddBundleView } from './QuickAddBundleView'
import { QuickAddInfoDialog } from './QuickAddInfoDialog'

const meta: Meta<typeof QuickAddBundleView> = {
  title: 'Components / Quick Add',
  component: QuickAddBundleView,
  parameters: { grid: { width: '1/3', align: 'center' } },
}

export default meta
type Story = StoryObj<typeof QuickAddBundleView>

const perils = [
  {
    title: 'Care and treatment',
    description:
      'The insurance provides compensation for costs incurred as a result of an accident where the injury required medical treatment.',
    covered: [
      'Medical care and prescribed aids for healing the injury',
      'Travel to and from treatment',
      'Clothes, glasses and helmet damaged in the accident',
      'Compensation up to 20 000 SEK per claim',
      'Costs within the Nordics are reimbursed',
    ],
    exceptions: [],
    colorCode: '#A4C9C6',
    __typename: 'Peril',
  },
  {
    title: 'Dental injury',
    description:
      'The insurance provides compensation for dental treatment costs incurred as a result of an accident that required treatment from a dentist.',
    covered: [
      'Dental care costs',
      'Costs within the Nordics are reimbursed',
      'Compensation up to 20 000 SEK per claim',
    ],
    exceptions: [],
    colorCode: '#A4C9C6',
    __typename: 'Peril',
  },
  {
    title: 'Hospitalisation',
    description: 'Reimbursement if you are admitted at the hospital overnight. ',
    covered: ['300 SEK per day', 'Up to 200 days for one claim'],
    exceptions: [],
    colorCode: '#689B96',
    __typename: 'Peril',
  },
  {
    title: 'Scarring',
    description:
      'Scarring due to an injury that required medical treatment following an accident are reimbursed with a lump sum.',
    covered: [
      'Scars or other change in appearance',
      'Compensation is determined by your age and the location and size of the scar',
    ],
    exceptions: [],
    colorCode: '#D5CE82',
    __typename: 'Peril',
  },
  {
    title: 'Crisis cover',
    description:
      'You have the right to treatment at a leg. psychologist if you suffer a crisis reaction after: an accident, death of a near relative, assault, robbery, threat or rape.',
    covered: [
      'Travel to and from treatment',
      'Treatment should begin within one year of the event',
      'Compensation up to 10 000 SEK per claim',
    ],
    exceptions: [],
    colorCode: '#689B96',
    __typename: 'Peril',
  },
  {
    title: 'Permanent injury',
    description:
      'If you suffer permanent injury after an accident (medical disability), you will receive compensation. The severity of the disability is assessed as a percentage according to the medical table system developed for the insurance industry. The compensation you receive is determined as a percentage of the insured amount.',
    covered: [
      'Maximum total compensation (combined with Lost or reduced working capacity) is 1 000 000 SEK',
    ],
    exceptions: [],
    colorCode: '#A396B6',
    __typename: 'Peril',
  },
  {
    title: 'Lost or reduced working capacity',
    description:
      'If your working capacity is reduced by more than 50% after an accidental injury, the insurance can provide compensation. A prerequisite is that the accident also resulted in at least 5% medical disability and that the Swedish social insurance agency granted at least half sickness compensation. Compensation is given as a percentage of the insured amount corresponding to the lost ability to work.',
    covered: ['Maximum total compensation (combined with Permanent injury) is 1 000 000 SEK '],
    exceptions: [],
    colorCode: '#A396B6',
    __typename: 'Peril',
  },
  {
    title: 'Death',
    description:
      'If you were to die as a result of an accident, a SEK 50,000 compensation will be paid from the accident insurance.',
    covered: ['50 000 SEK compensation'],
    exceptions: [],
    colorCode: '#705A87',
    __typename: 'Peril',
  },
] as Array<PerilFragment>

export const Default: Story = {
  args: {
    title: 'Home + Accident',
    subtitle: 'Covers 2 people',
    primaryPillow: {
      src: 'https://assets.hedvig.com/f/165473/832x832/cdaaa91242/hedvig-pillows-home.png',
    },
    secondaryPillow: {
      src: 'https://assets.hedvig.com/f/165473/832x832/1bb4813dd1/hedvig-pillows-accident.png',
    },
    href: '/se',
    price: {
      currencyCode: CurrencyCode.Sek,
      amount: 99,
    },
    badge: {
      children: 'Popular',
    },
    Body: (
      <>
        <Text as="p" color="textTranslucentSecondary">
          Increase your coverage with our accident insurance. Get compensation for dental, scars and
          much more.
          <QuickAddInfoDialog
            Header={
              <>
                <Pillow
                  size="xlarge"
                  src="https://assets.hedvig.com/f/165473/832x832/1bb4813dd1/hedvig-pillows-accident.png"
                />
                <Heading className={sprinkles({ mt: 'md' })} as="h1" variant="standard.18">
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
            <Perils items={perils} />
          </QuickAddInfoDialog>
        </Text>
        <div>
          <ProductUsp>Extra coverage for injuries and accidents</ProductUsp>
          <ProductUsp>Up to 1 000 000kr in compensation</ProductUsp>
          <ProductUsp>No deductible</ProductUsp>
        </div>
      </>
    ),
    Footer: (
      <Button size="medium" fullWidth={true}>
        Upgrade
      </Button>
    ),
  },
}
