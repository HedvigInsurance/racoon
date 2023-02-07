export enum BankIdState {
  Idle = 'Idle',
  Starting = 'Starting',
  Pending = 'Pending', // Waiting for user to open BankId app
  Success = 'Success',
  Error = 'Error',
}
