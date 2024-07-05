import { datadogRum } from '@datadog/browser-rum'
import { useCallback, useRef } from 'react'
import type { Subscription } from 'zen-observable-ts'
import { loginMemberSeBankId } from '@/services/authApi/login'
import { exchangeAuthorizationCode } from '@/services/authApi/oauth'
import { saveAuthTokens } from '@/services/authApi/persist'
import { useRoutingLocale } from '@/utils/l10n/useRoutingLocale'
import type { BankIdLoginOptions, LoginPromptOptions, StartLoginOptions } from './bankId.types'
import { apiStatusToBankIdState, bankIdLogger } from './bankId.utils'
import type { BankIdDispatch } from './bankIdReducer'

type HookOptions = {
  dispatch: BankIdDispatch
}

export const useBankIdLogin = ({ dispatch }: HookOptions) => {
  const onLoginPromptCompletedRef = useRef<(() => void) | null>(null)
  const showLoginPrompt = useCallback(
    ({ ssn, onCompleted }: LoginPromptOptions) => {
      datadogRum.addAction('bankIdLogin prompt')
      onLoginPromptCompletedRef.current = onCompleted
      dispatch({
        type: 'showLoginPrompt',
        ssn,
      })
    },
    [dispatch],
  )

  const { startLogin, cancelLogin } = useBankIdLoginApi({ dispatch })

  const startLoginWithCallbacks = useCallback(
    (options: StartLoginOptions) => {
      datadogRum.addAction('bankIdLogin start')
      dispatch({ type: 'startLogin', ssn: options.ssn })

      startLogin({
        ...options,
        async onSuccess() {
          datadogRum.addAction('bankIdLogin complete')
          onLoginPromptCompletedRef.current?.()
          // Wrap into Promise.resolve to allow both sync and async callbacks
          await Promise.resolve(options.onSuccess?.())
          dispatch({ type: 'success' })
        },
      })
    },
    [startLogin, dispatch],
  )

  const cancelLoginWithCallbacks = useCallback(() => {
    cancelLogin()
    onLoginPromptCompletedRef.current?.()
    datadogRum.addAction('bankIdLogin cancel')
    dispatch({ type: 'cancel' })
  }, [cancelLogin, dispatch])

  return {
    showLoginPrompt,
    startLogin: startLoginWithCallbacks,
    cancelLogin: cancelLoginWithCallbacks,
  }
}

export const useBankIdLoginApi = ({ dispatch }: HookOptions) => {
  const locale = useRoutingLocale()
  const subscriptionRef = useRef<Subscription | null>(null)
  const startLogin = useCallback(
    ({ ssn, onSuccess }: BankIdLoginOptions) => {
      bankIdLogger.info('Starting BankId login')
      // Future ideas
      // - try Observable.from().forEach to await final result and Promise.finally to clean up ref
      subscriptionRef.current = loginMemberSeBankId(ssn, locale).subscribe({
        async next(statusResponse) {
          dispatch({
            type: 'operationStateChange',
            nextOperationState: apiStatusToBankIdState(statusResponse.status),
          })

          const { liveQrCodeData, autoStartToken, bankidAppOpened } =
            statusResponse.seBankIdProperties
          dispatch({
            type: 'propertiesUpdate',
            qrCodeData: liveQrCodeData,
            autoStartToken,
            bankidAppOpened,
          })

          if (statusResponse.status === 'COMPLETED' && statusResponse.authorizationCode) {
            const { accessToken, refreshToken } = await exchangeAuthorizationCode(
              statusResponse.authorizationCode,
            )
            saveAuthTokens({ accessToken, refreshToken })
            bankIdLogger.info('Got access token')
            onSuccess()
          }
        },
        complete() {
          subscriptionRef.current = null
        },
        error(error?: string) {
          subscriptionRef.current = null
          dispatch({ type: 'error', error })
        },
      })
    },
    [dispatch, locale],
  )
  const cancelLogin = useCallback(() => {
    subscriptionRef.current?.unsubscribe()
  }, [])
  return { startLogin, cancelLogin }
}
