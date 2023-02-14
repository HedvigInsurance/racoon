import { useCallback, useRef } from 'react'
import { Subscription } from 'zen-observable-ts'
import { useShopSessionAuthenticateMutation } from '@/services/apollo/generated'
import { loginMemberSeBankId } from '@/services/authApi/login'
import { exchangeAuthorizationCode } from '@/services/authApi/oauth'
import { saveAccessToken } from '@/services/authApi/persist'
import { LoginPromptOptions } from './bankId.types'
import { apiStatusToBankIdState, bankIdLogger } from './bankId.utils'
import { BankIdDispatch } from './bankIdReducer'

type HookOptions = {
  dispatch: BankIdDispatch
}

export type BankIdLoginOptions = {
  shopSessionId: string
  ssn: string
  onSuccess: () => void
}

export const useBankIdLogin = ({ dispatch }: HookOptions) => {
  const onLoginPromptCompletedRef = useRef<(() => void) | null>(null)
  const showLoginPrompt = useCallback(
    ({ onCompleted }: LoginPromptOptions) => {
      onLoginPromptCompletedRef.current = onCompleted
      dispatch({
        type: 'showLoginPrompt',
      })
    },
    [dispatch],
  )

  const { startLogin, cancelLogin } = useBankIdLoginApi({ dispatch })

  const startLoginWithCallbacks = useCallback(
    (options: BankIdLoginOptions) => {
      startLogin({
        ...options,
        onSuccess() {
          onLoginPromptCompletedRef.current?.()
          options.onSuccess()
        },
      })
    },
    [startLogin],
  )

  const cancelLoginWithCallbacks = useCallback(() => {
    cancelLogin()
    onLoginPromptCompletedRef.current?.()
    dispatch({ type: 'cancel' })
  }, [cancelLogin, dispatch])

  return {
    showLoginPrompt,
    startLogin: startLoginWithCallbacks,
    cancelLogin: cancelLoginWithCallbacks,
  }
}

export const useBankIdLoginApi = ({ dispatch }: HookOptions) => {
  const subscriptionRef = useRef<Subscription | null>(null)
  const [authenticateShopSession] = useShopSessionAuthenticateMutation()
  const startLogin = useCallback(
    ({ shopSessionId, ssn, onSuccess }: BankIdLoginOptions) => {
      bankIdLogger.debug('Starting BankId login')
      // Future ideas
      // - try Observable.from().forEach to await final result and Promise.finally to clean up ref
      subscriptionRef.current = loginMemberSeBankId(ssn).subscribe({
        async next(statusResponse) {
          dispatch({
            type: 'operationStateChange',
            nextOperationState: apiStatusToBankIdState(statusResponse.status),
          })
          if (statusResponse.status === 'COMPLETED') {
            const accessToken = await exchangeAuthorizationCode(statusResponse.authorizationCode)
            saveAccessToken(accessToken)
            bankIdLogger.debug('Got access token, authenticating shopSession')
            await authenticateShopSession({ variables: { shopSessionId } })
            bankIdLogger.debug('shopSession authenticated')
            onSuccess()
          }
        },
        complete() {
          subscriptionRef.current = null
        },
        error(error: unknown) {
          subscriptionRef.current = null
          dispatch({ type: 'error', error })
        },
      })
    },
    [authenticateShopSession, dispatch],
  )
  const cancelLogin = useCallback(() => {
    subscriptionRef.current?.unsubscribe()
  }, [])
  return { startLogin, cancelLogin }
}
