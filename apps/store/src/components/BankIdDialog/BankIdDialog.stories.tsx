import { type Meta, type StoryFn } from '@storybook/react'
import { BankIdState } from '@/services/bankId/bankId.types'
import { BankIdContext, type BankIdContextValue } from '@/services/bankId/BankIdContext'
import { ShopSessionProvider } from '@/services/shopSession/ShopSessionContext'
import { BankIdDialog } from './BankIdDialog'

export default {
  title: 'components/BankIdDialog',
  component: BankIdDialog,
  parameters: {
    layout: 'fullscreen',
  },
} as Meta<typeof BankIdDialog>

const defaultContextValue: BankIdContextValue = {
  currentOperation: null,
  dispatch: () => {},
  startCheckoutSign: () => {},
  cancelCheckoutSign: () => {},
  startLogin: () => {},
  cancelLogin: () => {},
}

const Template: StoryFn<BankIdContextValue> = (contextValue) => {
  return (
    <ShopSessionProvider>
      <BankIdContext.Provider value={contextValue}>
        <BankIdDialog />
      </BankIdContext.Provider>
    </ShopSessionProvider>
  )
}

export const Pending = {
  render: Template,
  args: {
    ...defaultContextValue,
    currentOperation: {
      type: 'login',
      state: BankIdState.Pending,
      ssn: '111122334455',
      qrCodeData:
        'bankid.67df3917-fa0d-44e5-b327-edcc928297f8.0.dc69358e712458a66a7525beef148ae8526b1c71610eff2c16cdffb4cdac9bf8',
      autoStartToken: 'abc123',
    },
  },
}

export const QrCodeRead = {
  render: Template,
  args: {
    ...defaultContextValue,
    currentOperation: {
      type: 'login',
      state: BankIdState.Pending,
      ssn: '111122334455',
      bankidAppOpened: true,
      qrCodeData:
        'bankid.67df3917-fa0d-44e5-b327-edcc928297f8.0.dc69358e712458a66a7525beef148ae8526b1c71610eff2c16cdffb4cdac9bf8',
      autoStartToken: 'abc123',
    },
  },
}

export const Success = {
  render: Template,
  args: {
    ...defaultContextValue,
    currentOperation: {
      type: 'login',
      state: BankIdState.Success,
      ssn: '111122334455',
    },
  },
}

export const SessionTimedOutError = {
  render: Template,
  args: {
    ...defaultContextValue,
    currentOperation: {
      type: 'login',
      state: BankIdState.Error,
      ssn: '111122334455',
      error: 'Your BankID session timed out.\n Please try again.',
    },
  },
}
