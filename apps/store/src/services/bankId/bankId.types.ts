export enum BankIdState {
  Idle = 'Idle',
  Starting = 'Starting',
  Pending = 'Pending', // Waiting for user to open BankId app
  Success = 'Success',
  Error = 'Error',
}

export type BankIdOperationOptions = {
  onCancel: () => void
  onSuccess: () => void
  onError?: () => void
}

export type BankIdAction = {
  type:
    | 'showLoginPrompt'
    | 'operationStateChange'
    | 'startCheckoutSign'
    | 'success'
    | 'cancel'
    | 'error'
  options?: BankIdOperationOptions
  nextOperationState?: BankIdState
  error?: unknown
}
