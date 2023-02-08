import { useState } from 'react'
import {
  ShopSessionSigningStatus,
  useShopSessionSigningQuery,
  useShopSessionStartSignMutation,
} from '@/services/apollo/generated'
import { saveAccessToken } from '@/services/authApi/persist'
import { apiStatusToBankIdState, bankIdLogger } from '@/services/bankId/bankId.utils'
import { BankIdDispatch } from '@/services/bankId/bankIdReducer'
import { exchangeAuthorizationCode } from '../authApi/oauth'

export type Options = {
  shopSessionId: string
  dispatch: BankIdDispatch
  onSuccess: () => void
}

export const useBankIdCheckoutSign = ({ shopSessionId, dispatch, onSuccess }: Options) => {
  const [shopSessionSigningId, setShopSessionSigningId] = useState(null)

  useShopSessionSigningQuery({
    skip: shopSessionSigningId === null,
    variables: shopSessionSigningId ? { shopSessionSigningId } : undefined,
    pollInterval: 1000,
    async onCompleted(data) {
      const { status, completion } = data.shopSessionSigning
      dispatch({ type: 'operationStateChange', nextOperationState: apiStatusToBankIdState(status) })
      if (status === ShopSessionSigningStatus.Signed && completion) {
        bankIdLogger.debug('Signing complete')
        const accessToken = await exchangeAuthorizationCode(completion.authorizationCode)
        saveAccessToken(accessToken)
        onSuccess()
      }
    },
    onError(error) {
      bankIdLogger.warn('SigningQuery | Failed to sign', { error })
      setShopSessionSigningId(null)
      dispatch({ type: 'error', error })
    },
  })

  const [startSign] = useShopSessionStartSignMutation({
    variables: { shopSessionId },
    onCompleted(data) {
      const { signing, userError } = data.shopSessionStartSign
      if (userError) {
        dispatch({ type: 'error', error: userError })
      } else if (signing) {
        setShopSessionSigningId(signing.id)
        bankIdLogger.debug('Signing started')
      }
    },
    onError(error) {
      bankIdLogger.warn('StartSign | Failed to sign', { error })
      dispatch({ type: 'error', error })
    },
  })

  return startSign
}
