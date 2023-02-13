import { useCallback, useRef } from 'react'
import { Observable, Subscription } from 'zen-observable-ts'
import {
  ShopSessionSigningStatus,
  useShopSessionSigningLazyQuery,
  useShopSessionStartSignMutation,
} from '@/services/apollo/generated'
import { saveAccessToken } from '@/services/authApi/persist'
import { BankIdState } from '@/services/bankId/bankId.types'
import { apiStatusToBankIdState, bankIdLogger } from '@/services/bankId/bankId.utils'
import { BankIdDispatch } from '@/services/bankId/bankIdReducer'
import { exchangeAuthorizationCode } from '../authApi/oauth'

export type Options = {
  dispatch: BankIdDispatch
  onSuccess: () => void
}

type SignOptions = {
  shopSessionId: string
}

export const useBankIdCheckoutSign = ({ dispatch, onSuccess }: Options) => {
  const [fetchSigning, signingResult] = useShopSessionSigningLazyQuery({})

  const [starSignMutate] = useShopSessionStartSignMutation()

  const subscriptionRef = useRef<Subscription | null>(null)
  const startSign = useCallback(
    ({ shopSessionId }: SignOptions) => {
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
                const accessToken = await exchangeAuthorizationCode(completion.authorizationCode)
                saveAccessToken(accessToken)
                subscriber.complete()
              }
            },
            onError(error) {
              bankIdLogger.warn('SigningQuery | Failed to sign', { error })
              subscriber.error(error)
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
          console.log('next', value)
          dispatch({ type: 'operationStateChange', nextOperationState: value })
        },
        complete() {
          console.log('complete')
          onSuccess()
          subscriptionRef.current = null
        },
        error(error) {
          subscriptionRef.current = null
          dispatch({ type: 'error', error })
        },
      })
    },
    [dispatch, onSuccess, fetchSigning, signingResult, starSignMutate],
  )
  const cancelSign = () => {
    signingResult.stopPolling()
    subscriptionRef.current?.unsubscribe()
    dispatch({ type: 'cancel' })
  }

  return { startSign, cancelSign }
}
