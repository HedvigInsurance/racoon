import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from 'react'
import { ShopSessionAuthenticationStatus } from '@/services/apollo/generated'
import { BankIdOperationOptions } from '@/services/bankId/bankId.types'
import { bankIdLogger } from '@/services/bankId/bankId.utils'
import { BankIdDispatch, bankIdReducer, BankIdReducerState } from '@/services/bankId/bankIdReducer'
import { useBankIdCheckoutSign } from '@/services/bankId/useBankIdCheckoutSign'
import { useBankIdLogin } from '@/services/bankId/useBankIdLogin'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'

type LoginPromptOptions = { onCompleted: () => void }

type BankIdContextValue = BankIdReducerState & {
  dispatch: BankIdDispatch
  showLoginPrompt: (options: LoginPromptOptions) => void
  startCheckoutSign: (options: BankIdOperationOptions) => void
}

export const BankIdContext = createContext<BankIdContextValue | null>(null)

export const BankIdContextProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(bankIdReducer, { currentOperation: null })

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
      dispatch({
        type: 'startCheckoutSign',
        options,
      })
      if (authenticationStatus === ShopSessionAuthenticationStatus.AuthenticationRequired) {
        bankIdLogger.debug('Authentication required for returning member')
        await bankIdLogin()
      }
      startSign(options)
    },
    [authenticationStatus, bankIdLogin, startSign],
  )

  const contextValue = useMemo(
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
  return <BankIdContext.Provider value={contextValue}>{children}</BankIdContext.Provider>
}

export const useBankIdContext = () => {
  const value = useContext(BankIdContext)
  if (!value) {
    throw new Error('Cannot use BankIdContext outside of provider')
  }
  return value
}
