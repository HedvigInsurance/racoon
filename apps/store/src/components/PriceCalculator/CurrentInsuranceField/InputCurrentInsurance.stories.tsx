import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import type { Meta, StoryObj } from '@storybook/react'
import { InputCurrentInsurance } from './InputCurrentInsurance'

const meta: Meta<typeof InputCurrentInsurance> = {
  title: 'Inputs/Current Insurance',
  component: InputCurrentInsurance,
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
      defaultViewport: 'iphonese2',
    },
    grid: { width: '1/3' },
  },
  argTypes: { onCompanyChange: { action: 'changed' } },
}

export default meta
type Story = StoryObj<typeof InputCurrentInsurance>

export const Default: Story = {
  args: {
    label: 'Do you already have home insurance?',
    companyOptions: [
      {
        name: 'Folksam',
        value: 'se-folksam',
      },
      {
        name: 'Trygg Hansa',
        value: 'se-trygg-hansa',
      },
    ],
  },
}
