'use client'
import type { PropsWithChildren } from 'react'
import { createContext, useContext, useMemo, useReducer } from 'react'
import type { BankIdLoginOptions, CheckoutSignOptions } from './bankId.types'
import type { BankIdDispatch, BankIdReducerState } from './bankIdReducer'
import { bankIdReducer } from './bankIdReducer'
import { useBankIdCheckoutSign } from './useBankIdCheckoutSign'
import { useBankIdLogin } from './useBankIdLogin'

export type BankIdContextValue = BankIdReducerState & {
  dispatch: BankIdDispatch
  startLogin: (options: BankIdLoginOptions) => void
  cancelLogin: () => void
  startCheckoutSign: (options: CheckoutSignOptions) => void
  cancelCheckoutSign: () => void
}

export const BankIdContext = createContext<BankIdContextValue | null>(null)

export const BankIdContextProvider = ({ children }: PropsWithChildren) => {
  const [{ currentOperation }, dispatch] = useReducer(bankIdReducer, { currentOperation: null })

  const { startLogin, cancelLogin } = useBankIdLogin({ dispatch })
  const { startCheckoutSign, cancelCheckoutSign } = useBankIdCheckoutSign({ dispatch })

  const contextValue = useMemo(
    () => ({
      currentOperation,
      dispatch,
      startCheckoutSign,
      cancelCheckoutSign,
      startLogin,
      cancelLogin,
    }),
    [cancelCheckoutSign, cancelLogin, startCheckoutSign, startLogin, currentOperation],
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
