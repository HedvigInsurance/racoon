import { type ApolloError } from '@apollo/client'
import { ShopSessionAuthenticationStatus } from '@/services/graphql/generated'

export enum BankIdState {
  Idle = 'Idle',
  Starting = 'Starting',
  Pending = 'Pending', // Waiting for user to open BankId app
  Success = 'Success',
  Error = 'Error',
}

type BankIdLoginOperation = {
  type: 'login'
  ssn: string
  state: BankIdState
  error?: unknown
  qrCodeData?: string
}

type BankIdSignOperation = {
  type: 'sign'
  ssn: string
  customerAuthenticationStatus: ShopSessionAuthenticationStatus
  state: BankIdState
  error?: unknown
  qrCodeData?: string
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
  customerAuthenticationStatus: ShopSessionAuthenticationStatus
  shopSessionId: string
  ssn: string
  onSuccess: () => void | Promise<void>
  onError?: (error: ApolloError | Error) => void
}
