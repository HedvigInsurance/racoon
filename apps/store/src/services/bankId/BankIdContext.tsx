import { createContext, PropsWithChildren, useContext, useMemo, useReducer } from 'react'
import { CheckoutSignOptions, LoginPromptOptions, StartLoginOptions } from './bankId.types'
import { BankIdDispatch, bankIdReducer, BankIdReducerState } from './bankIdReducer'
import { useBankIdCheckoutSign } from './useBankIdCheckoutSign'
import { useBankIdLogin } from './useBankIdLogin'

type BankIdContextValue = BankIdReducerState & {
  dispatch: BankIdDispatch
  showLoginPrompt: (options: LoginPromptOptions) => void
  startLogin: (options: StartLoginOptions) => void
  cancelLogin: () => void
  startCheckoutSign: (options: CheckoutSignOptions) => void
  cancelCheckoutSign: () => void
}

export const BankIdContext = createContext<BankIdContextValue | null>(null)

export const BankIdContextProvider = ({ children }: PropsWithChildren) => {
  const [{ currentOperation }, dispatch] = useReducer(bankIdReducer, { currentOperation: null })

  const { showLoginPrompt, startLogin, cancelLogin } = useBankIdLogin({ dispatch })
  const { startCheckoutSign, cancelCheckoutSign } = useBankIdCheckoutSign({ dispatch })

  const contextValue = useMemo(
    () => ({
      currentOperation,
      dispatch,
      startCheckoutSign,
      cancelCheckoutSign,
      showLoginPrompt,
      startLogin,
      cancelLogin,
    }),
    [
      cancelCheckoutSign,
      cancelLogin,
      showLoginPrompt,
      startCheckoutSign,
      startLogin,
      currentOperation,
    ],
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
