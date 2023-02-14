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
  cancelCheckoutSign: () => void
}

export const BankIdContext = createContext<BankIdContextValue | null>(null)

export const BankIdContextProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(bankIdReducer, { currentOperation: null })

  // // TODO: Expose and handle errors
  const { shopSession } = useShopSession()
  const shopSessionId = shopSession?.id
  const { startLogin, cancelLogin } = useBankIdLogin({
    dispatch,
  })

  const { startSign, cancelSign } = useBankIdCheckoutSign({
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

  const startCheckoutSign: BankIdContextValue['startCheckoutSign'] = useCallback(
    async (options: BankIdOperationOptions) => {
      dispatch({
        type: 'startCheckoutSign',
        options,
      })

      if (
        shopSession &&
        shopSession.customer?.authenticationStatus ===
          ShopSessionAuthenticationStatus.AuthenticationRequired
      ) {
        const { ssn } = shopSession.customer
        if (!shopSessionId || !ssn)
          throw new Error('Must have shopSession with ID and customer SSN')
        bankIdLogger.debug('Authentication required for returning member')
        startLogin({
          shopSessionId,
          ssn,
          onSuccess() {
            startSign({ shopSessionId })
          },
        })
      } else {
        startSign({ shopSessionId })
      }
    },
    [shopSession, shopSessionId, startLogin, startSign],
  )

  const cancelCheckoutSign = useCallback(() => {
    cancelLogin()
    cancelSign()
  }, [cancelLogin, cancelSign])

  const showLoginPrompt = useCallback(({ onCompleted }: LoginPromptOptions) => {
    dispatch({
      type: 'showLoginPrompt',
      options: { onSuccess: onCompleted, onCancel: onCompleted },
    })
  }, [])

  const contextValue = useMemo(
    () => ({
      ...state,
      dispatch,
      showLoginPrompt,
      startCheckoutSign,
      cancelCheckoutSign,
    }),
    [cancelCheckoutSign, showLoginPrompt, startCheckoutSign, state],
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
