import {
  createContext,
  Dispatch,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from 'react'
import { ShopSessionAuthenticationStatus } from '@/services/apollo/generated'
import { BankIdAction, BankIdOperationOptions, BankIdState } from '@/services/bankId/bankId.types'
import { useBankIdCheckoutSign } from '@/services/bankId/useBankIdCheckoutSign'
import { useBankIdLogin } from '@/services/bankId/useBankIdLogin'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'

type BankIdOperation = {
  type: 'login' | 'sign'
  state: BankIdState
  onCancel: () => void
  onSuccess: () => void
  onError?: () => void
}

type BankdIdReducerState = {
  currentOperation: BankIdOperation | null
  lastError?: unknown
}

type LoginPromptOptions = { onCompleted: () => void }

type BankIdContextValue = BankdIdReducerState & {
  dispatch: Dispatch<BankIdAction>

  showLoginPrompt: (options: LoginPromptOptions) => void
  startCheckoutSign: (options: BankIdOperationOptions) => void
}

export const BankIdContext = createContext<BankIdContextValue | null>(null)

const bankdIdReducer = (state: BankdIdReducerState, action: BankIdAction): BankdIdReducerState => {
  switch (action.type) {
    case 'showLoginPrompt':
      console.log('slp', action.options)
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
    case 'success':
    case 'cancel':
      return {
        currentOperation: null,
      }
    case 'error': {
      return { currentOperation: null, lastError: action.error }
    }
  }
  return state
}

export const BankIdContextProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(bankdIdReducer, { currentOperation: null })

  // // TODO: Expose and handle errors
  const { shopSession } = useShopSession()
  const shopSessionId = shopSession?.id
  const ssn = shopSession?.customer?.ssn ?? ''
  const bankIdLogin = useBankIdLogin({
    shopSessionId,
    ssn,
    dispatch,
  })

  const startSign = useBankIdCheckoutSign({
    shopSessionId,
    dispatch,
    async onSuccess() {
      // NOTE: Keep dialog open until onSuccess resolves -> prevents returning to original checkout page state while waiting for redirect
      try {
        await state.currentOperation?.onSuccess()
      } finally {
        dispatch({ type: 'success' })
      }
    },
  })

  const { authenticationStatus } = shopSession?.customer ?? {}

  const startCheckoutSign: BankIdContextValue['startCheckoutSign'] = useCallback(
    async (options: BankIdOperationOptions) => {
      console.debug('startCheckoutSign', options)
      dispatch({
        type: 'startCheckoutSign',
        options,
      })
      if (authenticationStatus === ShopSessionAuthenticationStatus.AuthenticationRequired) {
        await bankIdLogin()
      }
      startSign(options)
    },
    [authenticationStatus, bankIdLogin, startSign],
  )

  // TODO: Try to make it work with ref, not memo
  //  Perhaps setCurrentOperation should take a callback to update value and make context consumers rerender?
  const value = useMemo(
    () => ({
      ...state,
      dispatch,
      showLoginPrompt({ onCompleted }: LoginPromptOptions) {
        dispatch({
          type: 'showLoginPrompt',
          options: { onSuccess: onCompleted, onCancel: onCompleted },
        })
      },
      startCheckoutSign,
    }),
    [startCheckoutSign, state],
  )
  return <BankIdContext.Provider value={value}>{children}</BankIdContext.Provider>
}

export const useBankIdContext = () => {
  const value = useContext(BankIdContext)
  if (!value) {
    throw new Error('Cannot use BankIdContext outside of provider')
  }
  return value
}
