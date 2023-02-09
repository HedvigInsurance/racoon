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
} & BankIdOperationOptions

export type BankIdOperationOptions = {
  onCancel: () => void
  onSuccess: () => void
  onError?: () => void
}
