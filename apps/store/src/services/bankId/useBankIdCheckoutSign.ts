import { useCallback, useRef } from 'react'
import { Observable, Subscription } from 'zen-observable-ts'
import {
  ShopSessionAuthenticationStatus,
  ShopSessionSigningStatus,
  useShopSessionSigningLazyQuery,
  useShopSessionStartSignMutation,
} from '@/services/apollo/generated'
import { exchangeAuthorizationCode } from '@/services/authApi/oauth'
import { saveAuthTokens } from '@/services/authApi/persist'
import { BankIdState, CheckoutSignOptions } from './bankId.types'
import { apiStatusToBankIdState, bankIdLogger } from './bankId.utils'
import { BankIdDispatch } from './bankIdReducer'
import { useBankIdLoginApi } from './useBankIdLogin'

export type Options = {
  dispatch: BankIdDispatch
}

export const useBankIdCheckoutSign = ({ dispatch }: Options) => {
  const { startLogin, cancelLogin } = useBankIdLoginApi({ dispatch })

  const { startSign, cancelSign } = useBankIdCheckoutSignApi({ dispatch })

  const startCheckoutSign = useCallback(
    async ({
      customerAuthenticationStatus,
      shopSessionId,
      ssn,
      onSuccess,
    }: // eslint-disable-next-line @typescript-eslint/require-await
    CheckoutSignOptions) => {
      const handleSuccess = async () => {
        // Delay marking operation as success until handler resolves
        try {
          await onSuccess()
        } finally {
          dispatch({ type: 'success' })
        }
      }

      dispatch({ type: 'startCheckoutSign', ssn, customerAuthenticationStatus })

      if (customerAuthenticationStatus === ShopSessionAuthenticationStatus.AuthenticationRequired) {
        bankIdLogger.debug('Authentication required for returning member')
        startLogin({
          ssn,
          onSuccess() {
            startSign({ shopSessionId, onSuccess: handleSuccess })
          },
        })
      } else {
        startSign({ shopSessionId, onSuccess: handleSuccess })
      }
    },
    [dispatch, startLogin, startSign],
  )

  const cancelCheckoutSign = useCallback(() => {
    cancelLogin()
    cancelSign()
    dispatch({ type: 'cancel' })
  }, [cancelLogin, cancelSign, dispatch])

  return {
    startCheckoutSign,
    cancelCheckoutSign,
  }
}

type SignOptions = {
  shopSessionId: string
  onSuccess: () => void
}

export const useBankIdCheckoutSignApi = ({ dispatch }: Options) => {
  const [fetchSigning, signingResult] = useShopSessionSigningLazyQuery({})

  const [starSignMutate] = useShopSessionStartSignMutation()

  const subscriptionRef = useRef<Subscription | null>(null)
  const startSign = useCallback(
    ({ shopSessionId, onSuccess }: SignOptions) => {
      subscriptionRef.current = new Observable<BankIdState>((subscriber) => {
        const startPolling = (shopSessionSigningId: string) => {
          fetchSigning({
            variables: { shopSessionSigningId },
            pollInterval: 1000,
            async onCompleted(data) {
              if (subscriber.closed) return
              const { status, completion } = data.shopSessionSigning
              subscriber.next(apiStatusToBankIdState(status))
              if (status === ShopSessionSigningStatus.Signed && completion) {
                signingResult.stopPolling()
                bankIdLogger.debug('Signing complete')
                const { accessToken, refreshToken } = await exchangeAuthorizationCode(
                  completion.authorizationCode,
                )
                saveAuthTokens({ accessToken, refreshToken })
                bankIdLogger.debug('Got access token')
                subscriber.complete()
              }
            },
            onError(error) {
              if (error.networkError) {
                bankIdLogger.warn('SigningQuery | Network error', { error: error.message })
              } else {
                bankIdLogger.warn('SigningQuery | Failed to sign', { error: error.message })
                subscriber.error(error)
              }
            },
          })
        }

        starSignMutate({
          variables: { shopSessionId },
          onCompleted(data) {
            if (subscriber.closed) return
            const { signing, userError } = data.shopSessionStartSign
            if (userError) {
              subscriber.error(userError)
            } else if (signing) {
              bankIdLogger.debug('Signing started')
              startPolling(signing.id)
            }
          },
          onError(error) {
            bankIdLogger.warn('StartSign | Failed to sign', { error })
            subscriber.error(error)
          },
        })
      }).subscribe({
        next(value) {
          dispatch({ type: 'operationStateChange', nextOperationState: value })
        },
        complete() {
          onSuccess()
          subscriptionRef.current = null
        },
        error(error) {
          subscriptionRef.current = null
          dispatch({ type: 'error', error })
        },
      })
    },
    [dispatch, fetchSigning, signingResult, starSignMutate],
  )
  const cancelSign = () => {
    signingResult.stopPolling()
    subscriptionRef.current?.unsubscribe()
  }

  return { startSign, cancelSign }
}
