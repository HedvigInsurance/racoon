import { type Meta, type StoryFn } from '@storybook/react'
import { BankIdState } from '@/services/bankId/bankId.types'
import { BankIdContext, type BankIdContextValue } from '@/services/bankId/BankIdContext'
import { BankIdV6Dialog } from './BankIdV6Dialog'

export default {
  title: 'components/BankIdV6Dialog',
  component: BankIdV6Dialog,
  parameters: {
    layout: 'fullscreen',
  },
} as Meta<typeof BankIdV6Dialog>

const defaultContextValue: BankIdContextValue = {
  currentOperation: null,
  dispatch: () => {},
  startCheckoutSign: () => {},
  cancelCheckoutSign: () => {},
  showLoginPrompt: () => {},
  startLogin: () => {},
  cancelLogin: () => {},
}

const Template: StoryFn<BankIdContextValue> = (contextValue) => {
  return (
    <BankIdContext.Provider value={contextValue}>
      <BankIdV6Dialog />
    </BankIdContext.Provider>
  )
}

export const Idle = Template.bind({})
Idle.args = {
  ...defaultContextValue,
  currentOperation: {
    type: 'login',
    state: BankIdState.Idle,
    ssn: '111122334455',
  },
}

export const Pending = Template.bind({})
Pending.args = {
  ...defaultContextValue,
  currentOperation: {
    type: 'login',
    state: BankIdState.Pending,
    ssn: '111122334455',
    qrCodeData:
      'bankid.67df3917-fa0d-44e5-b327-edcc928297f8.0.dc69358e712458a66a7525beef148ae8526b1c71610eff2c16cdffb4cdac9bf8',
  },
}

export const Success = Template.bind({})
Success.args = {
  ...defaultContextValue,
  currentOperation: {
    type: 'login',
    state: BankIdState.Success,
    ssn: '111122334455',
  },
}

export const SessionTimedOutError = Template.bind({})
SessionTimedOutError.args = {
  ...defaultContextValue,
  currentOperation: {
    type: 'login',
    state: BankIdState.Error,
    ssn: '111122334455',
    error: 'Your BankID session timed out.\n Please try again.',
  },
}
