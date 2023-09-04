import { type Meta, type StoryObj } from '@storybook/react'
import { CurrencyCode } from '@/services/apollo/generated'
import { QuickAdd } from './QuickAdd'

const meta: Meta<typeof QuickAdd> = {
  title: 'Components / Quick Add',
  component: QuickAdd,
  argTypes: {
    onAdd: { action: 'onAdd' },
    onDismiss: { action: 'onDismiss' },
  },
}

export default meta
type Story = StoryObj<typeof QuickAdd>

export const Default: Story = {
  args: {
    title: 'Accident insurance',
    subtitle: 'Covers 2 people',
    pillow: {
      src: 'https://a.storyblok.com/f/165473/832x832/a61cfbf4ae/hedvig-pillows-cat.png',
    },
    href: '/se',
    cost: {
      currencyCode: CurrencyCode.Sek,
      amount: 99,
    },
  },
}

export const WithDiscount: Story = {
  args: {
    ...Default.args,
    cost: {
      currencyCode: CurrencyCode.Sek,
      amount: 99,
      reducedAmount: 49,
    },
  },
}

export const Loading: Story = {
  args: {
    ...Default.args,
    loading: true,
  },
}
