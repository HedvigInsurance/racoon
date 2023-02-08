import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react'
import { ShopSessionAuthenticationStatus } from '@/services/apollo/generated'
import { BankIdOperationOptions, BankIdState } from '@/services/bankId/bankId.types'
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

type BankIdContextValue = {
  currentOperation: BankIdOperation | null
  cancelCurrentOperation: () => void

  showLoginPrompt: (options: BankIdOperationOptions) => void

  startCheckoutSign: (options: BankIdOperationOptions) => void

  startLogin: () => void
}

export const BankIdContext = createContext<BankIdContextValue | null>(null)

export const BankIdContextProvider = ({ children }: PropsWithChildren) => {
  const { shopSession } = useShopSession()
  const [currentOperation, setCurrentOperation] =
    useState<BankIdContextValue['currentOperation']>(null)

  // TODO: Expose and handle errors

  const showLoginPrompt: BankIdContextValue['showLoginPrompt'] = useCallback((options) => {
    setCurrentOperation({
      type: 'login',
      state: BankIdState.Idle,
      ...options,
    })
  }, [])

  const handleStateChange = useCallback((nextState: BankIdState) => {
    setCurrentOperation((currentOperation) => {
      if (!currentOperation) return currentOperation
      return {
        ...currentOperation,
        state: nextState,
      }
    })
  }, [])

  // Ensure we pass down stable callbacks than read latest currentOperation
  // TODO: Try refactoring with useReducer and pass down dispatch
  const handleSuccess = useRef<() => void>()
  handleSuccess.current = () => {
    currentOperation?.onSuccess()
  }
  const handleError = useRef<() => void>()
  handleError.current = () => {
    currentOperation?.onError?.()
  }

  const cancelCurrentOperation = useRef<() => void>()
  cancelCurrentOperation.current = () => {
    console.debug('TODO: Unsubscribe, stop polling, etc')
    currentOperation?.onCancel()
    setCurrentOperation(null)
  }

  const shopSessionId = shopSession?.id
  const ssn = shopSession?.customer?.ssn ?? ''
  const startLogin = useBankIdLogin({
    shopSessionId,
    ssn,
    onError: handleError.current!,
    onStateChange: handleStateChange,
    onSuccess: handleSuccess.current!,
    onCancel: cancelCurrentOperation.current!,
  })

  const startSign = useBankIdCheckoutSign({
    shopSessionId,
    onError: handleError.current!,
    onStateChange: handleStateChange,
    onSuccess: handleSuccess.current!,
    onCancel: cancelCurrentOperation.current!,
  })

  const { authenticationStatus } = shopSession?.customer ?? {}

  const startCheckoutSign: BankIdContextValue['startCheckoutSign'] = useCallback(
    (options) => {
      console.debug('startCheckoutSign', options)
      const showBankIdDialog =
        authenticationStatus !== ShopSessionAuthenticationStatus.Authenticated
      if (showBankIdDialog) {
        setCurrentOperation({
          type: 'sign',
          state: BankIdState.Starting,
          ...options,
        })
      }

      if (authenticationStatus === ShopSessionAuthenticationStatus.AuthenticationRequired) {
        startLogin({
          async onSuccess() {
            await startSign()
            handleSuccess.current!()
          },
        })
      } else {
        startSign(options)
      }
    },
    [authenticationStatus, startLogin, startSign],
  )

  // TODO: Try to make it work with ref, not memo
  //  Perhaps setCurrentOperation should take a callback to update value and make context consumers rerender?
  const value = useMemo(
    () => ({
      currentOperation,
      cancelCurrentOperation: cancelCurrentOperation.current!,
      showLoginPrompt,
      startCheckoutSign,
      startLogin,
    }),
    [currentOperation, showLoginPrompt, startCheckoutSign, startLogin],
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
