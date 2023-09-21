import { Meta, StoryObj } from '@storybook/react'
import { AppErrorProvider } from '@/services/appErrors/AppErrorContext'
import { BankIdContextProvider } from '@/services/bankId/BankIdContext'
import { ShopSessionProvider } from '@/services/shopSession/ShopSessionContext'
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
    shopSession: CAR_TRIAL_DATA_QUERY.shopSession,
  },

  render(args) {
    return (
      <AppErrorProvider>
        <BankIdContextProvider>
          <ShopSessionProvider>
            <TrialExtensionForm {...args} />
          </ShopSessionProvider>
        </BankIdContextProvider>
      </AppErrorProvider>
    )
  },
}

export default meta
