import { Dispatch } from 'react'
import {
  BankIdOperation,
  BankIdOperationOptions,
  BankIdState,
} from '@/services/bankId/bankId.types'

export type BankIdAction = StartAction | FinalAction | OperationStateChangeAction | ErrorAction
type StartAction = {
  type: 'showLoginPrompt' | 'startCheckoutSign'
  options: BankIdOperationOptions
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
  lastError?: unknown
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
          ...action.options!,
        },
      }
    case 'operationStateChange': {
      if (action.nextOperationState === state.currentOperation?.state) {
        break
      }
      if (!state.currentOperation || !action.nextOperationState) {
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
          ...action.options!,
        },
      }
    case 'success': {
      state.currentOperation?.onSuccess()
      return {
        currentOperation: null,
      }
    }
    case 'cancel':
      state.currentOperation?.onCancel()
      return {
        currentOperation: null,
      }
    case 'error': {
      if (!state.currentOperation) break
      state.currentOperation?.onError?.()
      return {
        currentOperation: { ...state.currentOperation, state: BankIdState.Error },
        lastError: action.error,
      }
    }
  }
  return state
}
