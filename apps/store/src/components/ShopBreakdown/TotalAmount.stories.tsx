import { type Meta, type StoryObj } from '@storybook/react'
import { CurrencyCode } from '@/services/apollo/generated'
import { TotalAmount } from './TotalAmount'

const meta: Meta<typeof TotalAmount> = {
  title: 'Components / Shop Breakdown / Total Amount',
  component: TotalAmount,
  parameters: { grid: { width: '1/3' } },
}

export default meta
type Story = StoryObj<typeof TotalAmount>

export const Default: Story = {
  args: {
    currencyCode: CurrencyCode.Sek,
    amount: 138,
  },
}

export const WithDiscount: Story = {
  args: {
    ...Default.args,
    discount: {
      reducedAmount: 0,
      explanation: 'i 6 månader, sedan 138 kr/mån',
    },
  },
}
