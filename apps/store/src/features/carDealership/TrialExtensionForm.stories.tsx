import { Meta, StoryObj } from '@storybook/react'
import { CurrencyCode } from '@/services/apollo/generated'
import { TrialExtensionForm } from './TrialExtensionForm'

type Story = StoryObj<typeof TrialExtensionForm>

const noop = () => {}

const meta: Meta<typeof TrialExtensionForm> = {
  title: 'TrialExtensionForm',
  component: TrialExtensionForm,
}

export const WithoutExtension: Story = {
  render: () => <TrialExtensionForm contract={FIXTURE_CONTRACT} onUndo={noop} />,
}

export default meta

const FIXTURE_CONTRACT = {
  id: 'contrac1',
  cost: { amount: 299, currencyCode: CurrencyCode.Sek },

  endDate: '2024-12-24',

  displayItems: [
    {
      displayTitle: 'Registration number',
      displayValue: 'ABC 123',
    },
    {
      displayTitle: 'Address',
      displayValue: 'Hedvigsgatan 11',
    },
    {
      displayTitle: 'Milage',
      displayValue: '1,500 km/year',
    },
  ],

  variant: {
    displayName: 'Product',
    product: {
      pillowImage: { src: 'https://placekitten.com/200/300' },
    },

    documents: [
      {
        displayName: 'Insurance terms',
        url: 'https://www.hedvig.com/se/forsakringar/hemforsakring/villkor',
      },
      {
        displayName: 'Insurance letter',
        url: 'https://www.hedvig.com/se/forsakringar/hemforsakring/brev',
      },
    ],
  },
}
