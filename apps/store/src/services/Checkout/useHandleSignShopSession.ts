import { datadogLogs } from '@datadog/browser-logs'
import { deleteCookie, setCookie } from 'cookies-next'
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
    variables: shopSessionSigningId ? { shopSessionSigningId: shopSessionSigningId } : undefined,
    pollInterval: 1000,
    async onCompleted(data) {
      const { status, completion } = data.shopSessionSigning
      if (status === ShopSessionSigningStatus.Signed && completion) {
        setShopSessionSigningId(null)
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

  return [
    startSign,
    {
      loading: result.loading || Boolean(shopSessionSigningId),
      signingStatus: queryResult.data?.shopSessionSigning.status,
      userError: getMutationError(result, result.data?.shopSessionStartSign),
    },
  ] as const
}
