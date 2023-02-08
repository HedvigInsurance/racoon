import { datadogLogs } from '@datadog/browser-logs'
import { useState } from 'react'
import {
  ShopSessionSigningStatus,
  useShopSessionSigningQuery,
  useShopSessionStartSignMutation,
} from '@/services/apollo/generated'
import { saveAccessToken } from '@/services/authApi/persist'
import { BankIdOperationOptions, BankIdState } from '@/services/bankId/bankId.types'
import { apiStatusToBankIdState } from '@/services/bankId/bankId.utils'
import { exchangeAuthorizationCode } from '../authApi/oauth'

export type Options = {
  shopSessionId: string
  onStateChange: (state: BankIdState) => void
} & BankIdOperationOptions

export const useBankIdCheckoutSign = ({
  shopSessionId,
  onError,
  onStateChange,
  onSuccess,
}: Options) => {
  // TODO: Handle and expose errors
  const [shopSessionSigningId, setShopSessionSigningId] = useState(null)

  useShopSessionSigningQuery({
    skip: shopSessionSigningId === null,
    variables: shopSessionSigningId ? { shopSessionSigningId } : undefined,
    pollInterval: 1000,
    async onCompleted(data) {
      const { status, completion } = data.shopSessionSigning
      onStateChange(apiStatusToBankIdState(status))
      if (status === ShopSessionSigningStatus.Signed && completion) {
        datadogLogs.logger.debug('Checkout | Signing complete')
        const accessToken = await exchangeAuthorizationCode(completion.authorizationCode)
        saveAccessToken(accessToken)
        onSuccess()
      }
    },
    onError(error) {
      datadogLogs.logger.warn('Checkout | SigningQuery | Failed to sign', { error })
      setShopSessionSigningId(null)
      onError?.()
    },
  })

  const [startSign] = useShopSessionStartSignMutation({
    variables: { shopSessionId },
    onCompleted(data) {
      const { signing, userError } = data.shopSessionStartSign
      if (signing && !userError) {
        setShopSessionSigningId(signing.id)
      }
    },
    onError(error) {
      datadogLogs.logger.warn('Checkout | StartSign | Failed to sign', { error })
      onError?.()
    },
  })

  return startSign
}
