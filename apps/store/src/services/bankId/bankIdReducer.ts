import { Dispatch } from 'react'
import { ShopSessionAuthenticationStatus } from '@/services/apollo/generated'
import { BankIdOperation, BankIdState } from './bankId.types'

export type BankIdAction =
  | ShowLoginPromptAction
  | StartLoginAction
  | StartSignAction
  | FinalAction
  | OperationStateChangeAction
  | ErrorAction

type ShowLoginPromptAction = {
  type: 'showLoginPrompt'
  ssn: string
}
type StartLoginAction = {
  type: 'startLogin'
  ssn: string
}
type StartSignAction = {
  type: 'startCheckoutSign'
  ssn: string
  customerAuthenticationStatus: ShopSessionAuthenticationStatus
}
type FinalAction = {
  type: 'cancel' | 'success'
}
type OperationStateChangeAction = {
  type: 'operationStateChange'
  nextOperationState: BankIdState
}
type ErrorAction = {
  type: 'error'
  error: unknown
}

export type BankIdReducerState = {
  currentOperation: BankIdOperation | null
}

export type BankIdDispatch = Dispatch<BankIdAction>

export const bankIdReducer = (
  state: BankIdReducerState,
  action: BankIdAction,
): BankIdReducerState => {
  switch (action.type) {
    case 'showLoginPrompt':
      return {
        currentOperation: {
          type: 'login',
          state: BankIdState.Idle,
          ssn: action.ssn,
        },
      }
    case 'startLogin':
      return {
        currentOperation: {
          type: 'login',
          state: BankIdState.Starting,
          ssn: action.ssn,
        },
      }
    case 'operationStateChange': {
      if (!state.currentOperation) {
        break
      }
      if (action.nextOperationState === state.currentOperation.state) {
        break
      }
      return {
        currentOperation: {
          ...state.currentOperation,
          state: action.nextOperationState,
        },
      }
    }
    case 'startCheckoutSign':
      return {
        currentOperation: {
          type: 'sign',
          state: BankIdState.Starting,
          ssn: action.ssn,
          customerAuthenticationStatus: action.customerAuthenticationStatus,
        },
      }
    case 'cancel':
    case 'success': {
      return {
        currentOperation: null,
      }
    }
    case 'error': {
      if (!state.currentOperation) break
      return {
        currentOperation: {
          ...state.currentOperation,
          state: BankIdState.Error,
          error: action.error,
        },
      }
    }
  }
  return state
}
