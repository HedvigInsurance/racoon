import { datadogLogs } from '@datadog/browser-logs'
import { useState } from 'react'
import {
  ShopSessionSigningStatus,
  useShopSessionSigningQuery,
  useShopSessionStartSignMutation,
} from '@/services/apollo/generated'
import { useGetMutationError } from '@/utils/useGetMutationError'
import { exchangeAuthorizationCode } from '../authApi/oauth'

export type Params = {
  shopSessionId: string
  shopSessionSigningId: string | null
  onSuccess: (accessToken: string) => void
  onError?: () => void
}

export const useHandleSignShopSession = (params: Params) => {
  const getMutationError = useGetMutationError()
  const {
    shopSessionSigningId: initialShopSessionSigningId,
    shopSessionId,
    onSuccess,
    onError,
  } = params
  const [shopSessionSigningId, setShopSessionSigningId] = useState(initialShopSessionSigningId)

  const queryResult = useShopSessionSigningQuery({
    skip: shopSessionSigningId === null,
    variables: shopSessionSigningId ? { shopSessionSigningId } : undefined,
    pollInterval: 1000,
    async onCompleted(data) {
      const { status, completion } = data.shopSessionSigning
      if (status === ShopSessionSigningStatus.Signed && completion) {
        // TODO: Handle errors
        console.debug('Congratulations, signing complete!', completion)
        const accessToken = await exchangeAuthorizationCode(completion.authorizationCode)
        // FIXME: Update, make it session scoped (maybe)
        // deleteCookie(shopSessionId)
        onSuccess(accessToken)
      }
    },
    onError(error) {
      datadogLogs.logger.warn('Checkout | SigningQuery | Failed to sign', { error })
      setShopSessionSigningId(null)
    },
  })

  const [startSign, result] = useShopSessionStartSignMutation({
    variables: { shopSessionId },
    onCompleted(data) {
      const { signing, userError } = data.shopSessionStartSign
      if (signing && !userError) {
        setShopSessionSigningId(signing.id)
        // FIXME: Clean up, no need to set it (probably)
        // setCookie(shopSessionId, signing.id)
      }
    },
    onError(error) {
      datadogLogs.logger.warn('Checkout | StartSign | Failed to sign', { error })
      onError?.()
    },
  })

  const signingStatus = queryResult.data?.shopSessionSigning.status
  const signingFailed = signingStatus === ShopSessionSigningStatus.Failed
  const isSigning = Boolean(shopSessionSigningId) && !signingFailed

  return [
    startSign,
    {
      loading: result.loading || isSigning,
      signingStatus,
      userError: getMutationError(result, result.data?.shopSessionStartSign),
    },
  ] as const
}
