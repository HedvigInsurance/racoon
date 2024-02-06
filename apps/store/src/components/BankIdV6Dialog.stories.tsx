import { type Meta, type StoryFn } from '@storybook/react'
import { BankIdState } from '@/services/bankId/bankId.types'
import { BankIdContext, type BankIdContextValue } from '@/services/bankId/BankIdContext'
import { BankIdV6Dialog } from './BankIdV6Dialog'

export default {
  title: 'BankIdV6Dialog',
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

export const Error = Template.bind({})
Error.args = {
  ...defaultContextValue,
  currentOperation: {
    type: 'login',
    state: BankIdState.Error,
    ssn: '111122334455',
  },
}
