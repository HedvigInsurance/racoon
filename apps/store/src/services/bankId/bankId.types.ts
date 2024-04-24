import { type ApolloError } from '@apollo/client'

export enum BankIdState {
  Idle = 'Idle',
  Starting = 'Starting',
  Pending = 'Pending', // Waiting for user to open BankId app
  Success = 'Success',
  Error = 'Error',
}

export type BankIdLoginOperation = {
  type: 'login'
  ssn: string
  state: BankIdState
  error?: string
  qrCodeData?: string
  autoStartToken?: string
  bankidAppOpened?: boolean
}

export type BankIdSignOperation = {
  type: 'sign'
  ssn: string
  state: BankIdState
  error?: string
  qrCodeData?: string
  autoStartToken?: string
  bankidAppOpened?: boolean
}

export type BankIdOperation = BankIdLoginOperation | BankIdSignOperation

export type LoginPromptOptions = {
  ssn: string
  onCompleted: () => void
}

export type BankIdLoginOptions = {
  ssn: string
  onSuccess: () => void
}

export type StartLoginOptions = { ssn: string; onSuccess?: () => void | Promise<void> }

export type CheckoutSignOptions = {
  shopSessionId: string
  ssn: string
  onSuccess: () => void | Promise<void>
  onError?: (error: ApolloError | Error) => void
}
