import type { Meta, StoryObj } from '@storybook/react'
import { type FormEvent } from 'react'
import { CurrencyCode } from '@/services/graphql/generated'
import { TotalPrice } from './TotalPrice'
type Controls = {
  onOpenChange?: (isOpen: boolean) => void
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void
}
const meta: Meta<typeof TotalPrice> = {
  title: 'Components / ProductCard / TotalPrice',
  component: TotalPrice,
}
export default meta
type Story = StoryObj<Controls>
export const Default: Story = {
  render: () => (
    <div style={{ maxWidth: '400px' }}>
      <TotalPrice currencyCode={CurrencyCode.Sek} amount={379} />
    </div>
  ),
}
export const WithDiscount: Story = {
  render: () => (
    <div style={{ maxWidth: '400px' }}>
      <TotalPrice
        currencyCode={CurrencyCode.Sek}
        amount={379}
        reducedAmount={300}
        note="-20% for 3 months, then 379 kr/mo"
      />
    </div>
  ),
}
export const DifferentLabel: Story = {
  render: () => (
    <div style={{ maxWidth: '400px' }}>
      <TotalPrice
        label="Price"
        currencyCode={CurrencyCode.Sek}
        amount={379}
        reducedAmount={300}
        note="-20% for 3 months, then 379 kr/mo"
      />
    </div>
  ),
}
