import { type ApolloError } from '@apollo/client'
import { datadogRum } from '@datadog/browser-rum'
import { useTranslation } from 'next-i18next'
import { useCallback, useRef } from 'react'
import type { Subscription } from 'zen-observable-ts'
import { Observable } from 'zen-observable-ts'
import { exchangeAuthorizationCode } from '@/services/authApi/oauth'
import { saveAuthTokens } from '@/services/authApi/persist'
import {
  ShopSessionSigningStatus,
  useShopSessionSigningLazyQuery,
  useShopSessionStartSignMutation,
} from '@/services/graphql/generated'
import type { BankIdState, BankIdSignOperation, CheckoutSignOptions } from './bankId.types'
import { apiStatusToBankIdState, bankIdLogger } from './bankId.utils'
import type { BankIdDispatch } from './bankIdReducer'

export type Options = {
  dispatch: BankIdDispatch
}

export const useBankIdCheckoutSign = ({ dispatch }: Options) => {
  const { startSign, cancelSign } = useBankIdCheckoutSignApi({ dispatch })

  const startCheckoutSign = useCallback(
    async ({
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
          datadogRum.addAction('bankIdSign complete')
        } finally {
          dispatch({ type: 'success' })
        }
      }

      dispatch({ type: 'startCheckoutSign', ssn })
      datadogRum.addAction('bankIdSign start')

      startSign({ shopSessionId, onSuccess: handleSuccess, onError })
    },
    [dispatch, startSign],
  )

  const cancelCheckoutSign = useCallback(() => {
    cancelSign()
    dispatch({ type: 'cancel' })
  }, [cancelSign, dispatch])

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

const useBankIdCheckoutSignApi = ({ dispatch }: Options) => {
  const { t } = useTranslation('checkout')
  const [fetchSigning, signingResult] = useShopSessionSigningLazyQuery({})

  const [startSignMutate] = useShopSessionStartSignMutation()

  const subscriptionRef = useRef<Subscription | null>(null)
  const startSign = useCallback(
    ({ shopSessionId, onSuccess, onError }: SignOptions) => {
      subscriptionRef.current = new Observable<{
        nextOperationState: BankIdState
        qrCodeData: BankIdSignOperation['qrCodeData']
        autoStartToken: BankIdSignOperation['autoStartToken']
        bankidAppOpened: BankIdSignOperation['bankidAppOpened']
      }>((subscriber) => {
        const startPolling = (shopSessionSigningId: string) => {
          bankIdLogger.setContextProperty('shopSessionId', shopSessionId)

          fetchSigning({
            variables: { shopSessionSigningId },
            pollInterval: 1000,
            // Make sure 'onCompleted' gets called during the whole pooling process
            // https://github.com/apollographql/apollo-client/pull/10229
            notifyOnNetworkStatusChange: true,
            async onCompleted(data) {
              if (subscriber.closed) return
              const { status, completion, seBankidProperties, userError } = data.shopSessionSigning
              subscriber.next({
                nextOperationState: apiStatusToBankIdState(status),
                qrCodeData: seBankidProperties?.liveQrCodeData,
                autoStartToken: seBankidProperties?.autoStartToken,
                bankidAppOpened: seBankidProperties?.bankidAppOpened,
              })
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
                subscriber.error(userError?.message ?? t('ERROR_GENERAL_DIALOG_PROMPT'))
              }
            },
            onError(error) {
              if (error.networkError) {
                bankIdLogger.warn('SigningQuery | Network error', { error: error.message })
                // TODO: better error handling for network errors. E.g: show a offline message to the user
              } else {
                signingResult.stopPolling()
                bankIdLogger.warn('SigningQuery | Failed to sign', { error: error.message })
                subscriber.error(error.message)
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
              subscriber.error(userError.message ?? t('ERROR_GENERAL_DIALOG_PROMPT'))
            } else if (signing) {
              bankIdLogger.info('Signing started')
              startPolling(signing.id)
            }
          },
          onError(error) {
            if (error.networkError) {
              bankIdLogger.warn('StartSign | Network error', { error: error.message })
              subscriber.error(t('ERROR_GENERAL_DIALOG_PROMPT'))
            } else {
              bankIdLogger.warn('StartSign | Failed to sign', { error })
              subscriber.error(error.message)
            }
          },
        })
      }).subscribe({
        next({ nextOperationState, qrCodeData, autoStartToken, bankidAppOpened }) {
          dispatch({ type: 'operationStateChange', nextOperationState })
          dispatch({ type: 'propertiesUpdate', qrCodeData, autoStartToken, bankidAppOpened })
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
    [dispatch, fetchSigning, signingResult, startSignMutate, t],
  )
  const cancelSign = () => {
    signingResult.stopPolling()
    subscriptionRef.current?.unsubscribe()
  }

  return { startSign, cancelSign }
}
