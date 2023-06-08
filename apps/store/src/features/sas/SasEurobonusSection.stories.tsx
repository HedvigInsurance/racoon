import { type Meta, type StoryFn } from '@storybook/react'
import { SasEurobonusSection } from './SasEurobonusSection'

const meta: Meta<typeof SasEurobonusSection> = {
  title: 'Checkout / SAS Eurobonus Section',
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
}

export default meta

export const Default: StoryFn<typeof SasEurobonusSection> = (props) => {
  return <SasEurobonusSection {...props} />
}
