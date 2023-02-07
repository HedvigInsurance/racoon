import { datadogLogs } from '@datadog/browser-logs'
import { createContext, PropsWithChildren, useCallback, useContext, useMemo, useState } from 'react'
import { useShopSessionAuthenticateMutation } from '@/services/apollo/generated'
import { loginMemberSeBankId } from '@/services/authApi/login'
import { exchangeAuthorizationCode } from '@/services/authApi/oauth'
import { saveAccessToken } from '@/services/authApi/persist'
import { BankIdState } from '@/services/bankId/bankId.types'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'

type BankIdOperation = {
  type: 'login'
  state: BankIdState
}

type BankIdContextValue = {
  currentOperation: BankIdOperation | null
  cancelCurrentOperation: () => void

  showLoginPrompt: () => void
  startLogin: () => void
}

export const BankIdContext = createContext<BankIdContextValue | null>(null)

export const BankIdContextProvider = ({ children }: PropsWithChildren) => {
  const { shopSession } = useShopSession()
  const [currentOperation, setCurrentOperation] =
    useState<BankIdContextValue['currentOperation']>(null)

  // TODO: Expose and handle errors
  const [authenticateShopSession] = useShopSessionAuthenticateMutation()

  const showLoginPrompt = useCallback(() => {
    console.log('init login')
    setCurrentOperation({
      type: 'login',
      state: BankIdState.Idle,
    })
  }, [])

  const shopSessionId = shopSession?.id
  const ssn = shopSession?.customer?.ssn

  const startLogin = useCallback(async () => {
    if (!shopSessionId || !ssn) throw new Error('Must have shopSession with ID and customer SSN')
    if (!currentOperation) throw new Error('Must have currentOperation')

    const setOperationState = (nextState: BankIdState) => {
      setCurrentOperation({ ...currentOperation, state: nextState })
    }

    datadogLogs.logger.log('Starting BankId login')
    setOperationState(BankIdState.Starting)
    try {
      const authorizationCode = await loginMemberSeBankId(ssn, (status) => {
        switch (status) {
          case 'PENDING':
            setOperationState(BankIdState.Pending)
            break
          case 'COMPLETED':
            setOperationState(BankIdState.Success)
            break
          case 'FAILED':
            setOperationState(BankIdState.Error)
            break
        }
      })
      const accessToken = await exchangeAuthorizationCode(authorizationCode)
      saveAccessToken(accessToken)
      await authenticateShopSession({ variables: { shopSessionId } })
      setCurrentOperation(null)
    } catch (error) {
      datadogLogs.logger.warn('Failed to authenticate', { error })
      setOperationState(BankIdState.Error)
    }
  }, [authenticateShopSession, currentOperation, shopSessionId, ssn])

  const cancelCurrentOperation = useCallback(() => {
    console.log('TODO: Unsubscribe, stop polling, etc')
    setCurrentOperation(null)
  }, [])

  const value = useMemo(
    () => ({ currentOperation, cancelCurrentOperation, showLoginPrompt, startLogin }),
    [currentOperation, cancelCurrentOperation, showLoginPrompt, startLogin],
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
