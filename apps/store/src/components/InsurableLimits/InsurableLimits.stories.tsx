import type { Meta } from '@storybook/react'
import { InsurableLimits } from './InsurableLimits'

const meta: Meta<typeof InsurableLimits> = {
  component: InsurableLimits,
}

export default meta

const limits = [
  {
    label: 'Deductible',
    value: 'SEK 1,500',
    description:
      'Ersättningen för dina saker är upp till 1 000 000 SEK. Det betyder att du kan lorem ipsum dolor sit amet.',
  },
  { label: 'Insured amount', value: 'SEK 1,000,000', description: 'Lorem ipsum dolor sit amet.' },
  {
    label: 'Travel',
    value: 'Up to 45 days/trip when its a long trip',
    description: 'Lorem ipsum dolor sit amet.',
  },
  {
    label: 'Bike coverage',
    value: 'Up to SEK 15,000',
    description: 'Lorem ipsum dolor sit amet.',
  },
]

export const Default = {
  args: {
    items: limits,
  },
}
