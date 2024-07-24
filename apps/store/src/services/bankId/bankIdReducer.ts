import { datadogRum } from '@datadog/browser-rum'
import type { Dispatch } from 'react'
import type { BankIdOperation } from './bankId.types'
import { BankIdState } from './bankId.types'

export type BankIdAction =
  | StartLoginAction
  | StartSignAction
  | PropertiesUpdateAction
  | FinalAction
  | OperationStateChangeAction
  | ErrorAction

type StartLoginAction = {
  type: 'startLogin'
  ssn: string
}
type StartSignAction = {
  type: 'startCheckoutSign'
  ssn: string
}
type PropertiesUpdateAction = {
  type: 'propertiesUpdate'
  qrCodeData?: string
  autoStartToken?: string
  bankidAppOpened?: boolean
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
  error?: string
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
    case 'propertiesUpdate': {
      if (!state.currentOperation) {
        break
      }

      const hasQRCodeBeenScanned = !state.currentOperation.bankidAppOpened && action.bankidAppOpened
      if (hasQRCodeBeenScanned) {
        const operation = state.currentOperation.type === 'login' ? 'bankIdLogin' : 'bankIdSign'
        datadogRum.addAction(`${operation} qrCodeScanned`)
      }

      return {
        currentOperation: {
          ...state.currentOperation,
          qrCodeData: action.qrCodeData,
          autoStartToken: action.autoStartToken,
          bankidAppOpened: action.bankidAppOpened,
        },
      }
    }
    case 'startCheckoutSign':
      return {
        currentOperation: {
          type: 'sign',
          state: BankIdState.Starting,
          ssn: action.ssn,
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
