import type { StoryObj } from '@storybook/react'
import { type Meta } from '@storybook/react'
import { SasEurobonusSection } from './SasEurobonusSection'

const meta: Meta<typeof SasEurobonusSection> = {
  title: 'Checkout / ConfirmationPage / SAS Eurobonus Section',
  component: SasEurobonusSection,
  args: {
    state: 'idle',
    eurobonusNumber: '',
  },
  argTypes: {
    onEurobonusNumberSave: { action: 'onEurobonusNumberSave' },
    state: {
      options: ['idle', 'loading', 'error', 'complete'],
      control: 'select',
    },
  },
  parameters: { grid: { width: '1/3' } },
}

export default meta

export const Default: StoryObj<typeof SasEurobonusSection> = {}
