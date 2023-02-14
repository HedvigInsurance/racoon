import { ShopSessionAuthenticationStatus } from '@/services/apollo/generated'

export enum BankIdState {
  Idle = 'Idle',
  Starting = 'Starting',
  Pending = 'Pending', // Waiting for user to open BankId app
  Success = 'Success',
  Error = 'Error',
}

export type BankIdOperation = {
  type: 'login' | 'sign'
  state: BankIdState
  error?: unknown
}

export type LoginPromptOptions = {
  onCompleted: () => void
}

export type CheckoutSignOptions = {
  customerAuthenticationStatus: ShopSessionAuthenticationStatus
  shopSessionId: string
  ssn: string
  onSuccess: () => void | Promise<void>
}
