import { type ApolloError } from '@apollo/client'
import { useCallback, useRef } from 'react'
import { Observable, Subscription } from 'zen-observable-ts'
import { exchangeAuthorizationCode } from '@/services/authApi/oauth'
import { saveAuthTokens } from '@/services/authApi/persist'
import {
  ShopSessionAuthenticationStatus,
  ShopSessionSigningStatus,
  useShopSessionSigningLazyQuery,
  useShopSessionStartSignMutation,
} from '@/services/graphql/generated'
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
      onError,
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
        bankIdLogger.info('Authentication required for returning member')
        startLogin({
          ssn,
          onSuccess() {
            startSign({ shopSessionId, onSuccess: handleSuccess, onError })
          },
        })
      } else {
        startSign({ shopSessionId, onSuccess: handleSuccess, onError })
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
  onError?: (error: ApolloError | Error) => void
}

export const useBankIdCheckoutSignApi = ({ dispatch }: Options) => {
  const [fetchSigning, signingResult] = useShopSessionSigningLazyQuery({})

  const [startSignMutate] = useShopSessionStartSignMutation()

  const subscriptionRef = useRef<Subscription | null>(null)
  const startSign = useCallback(
    ({ shopSessionId, onSuccess, onError }: SignOptions) => {
      subscriptionRef.current = new Observable<BankIdState>((subscriber) => {
        const startPolling = (shopSessionSigningId: string) => {
          fetchSigning({
            variables: { shopSessionSigningId },
            pollInterval: 1000,
            // Make sure 'onCompleted' gets called during the whole pooling process
            // https://github.com/apollographql/apollo-client/pull/10229
            notifyOnNetworkStatusChange: true,
            async onCompleted(data) {
              if (subscriber.closed) return
              const { status, completion } = data.shopSessionSigning
              subscriber.next(apiStatusToBankIdState(status))
              if (status === ShopSessionSigningStatus.Signed && completion) {
                signingResult.stopPolling()
                bankIdLogger.info('Signing complete')
                const { accessToken, refreshToken } = await exchangeAuthorizationCode(
                  completion.authorizationCode,
                )
                saveAuthTokens({ accessToken, refreshToken })
                bankIdLogger.info('Got access token')
                subscriber.complete()
              } else if (status === ShopSessionSigningStatus.Failed) {
                signingResult.stopPolling()
                bankIdLogger.info('Signing failed')
                // TODO: figure it what error to show here. Maybe exposing something from ShopsessionSigningQuery
                subscriber.error(new Error('Signing failed'))
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

        startSignMutate({
          variables: { shopSessionId },
          onCompleted(data) {
            if (subscriber.closed) return
            const { signing, userError } = data.shopSessionStartSign
            if (userError) {
              bankIdLogger.warn('StartSign | Failed to sign', { error: userError })
              subscriber.error(userError)
            } else if (signing) {
              bankIdLogger.info('Signing started')
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
          onError?.(error)
        },
      })
    },
    [dispatch, fetchSigning, signingResult, startSignMutate],
  )
  const cancelSign = () => {
    signingResult.stopPolling()
    subscriptionRef.current?.unsubscribe()
  }

  return { startSign, cancelSign }
}