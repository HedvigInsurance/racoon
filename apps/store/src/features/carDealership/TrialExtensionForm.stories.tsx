import { Meta, StoryObj } from '@storybook/react'
import { AppErrorProvider } from '@/services/appErrors/AppErrorContext'
import { CAR_TRIAL_DATA_QUERY } from './carDealershipFixtures'
import { TrialExtensionForm } from './TrialExtensionForm'

type Story = StoryObj<typeof TrialExtensionForm>

const meta: Meta<typeof TrialExtensionForm> = {
  title: 'Car Dealership / Trial Extension Form',
  component: TrialExtensionForm,
}

export const WithoutExtension: Story = {
  args: {
    contract: CAR_TRIAL_DATA_QUERY.trialContract,
    priceIntent: CAR_TRIAL_DATA_QUERY.priceIntent,
  },

  render(args) {
    return (
      <AppErrorProvider>
        <TrialExtensionForm {...args} />
      </AppErrorProvider>
    )
  },
}

export default meta
