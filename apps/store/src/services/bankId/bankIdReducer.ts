import { Dispatch } from 'react'
import { BankIdOperation, BankIdState } from './bankId.types'

export type BankIdAction = StartAction | FinalAction | OperationStateChangeAction | ErrorAction
type StartAction = {
  type: 'showLoginPrompt' | 'startCheckoutSign'
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
        },
      }
    case 'operationStateChange': {
      if (!state.currentOperation || !action.nextOperationState) {
        break
      }
      if (action.nextOperationState === state.currentOperation?.state) {
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
