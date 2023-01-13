import { datadogLogs } from '@datadog/browser-logs'
import { deleteCookie, setCookie } from 'cookies-next'
import { useState } from 'react'
import {
  CheckoutSigningStatus,
  useCheckoutSigningQuery,
  useCheckoutStartSignMutation,
} from '@/services/apollo/generated'
import { useGetMutationError } from '@/utils/useGetMutationError'
import { exchangeAuthorizationCode } from '../authApi/oauth'

export type Params = {
  checkoutId: string
  checkoutSigningId: string | null
  onSuccess: (accessToken: string) => void
  onError?: () => void
}

export const useHandleSignCheckout = (params: Params) => {
  const getMutationError = useGetMutationError()
  const { checkoutId, checkoutSigningId: initialCheckoutSigningId, onSuccess, onError } = params
  const [checkoutSigningId, setCheckoutSigningId] = useState(initialCheckoutSigningId)

  const queryResult = useCheckoutSigningQuery({
    skip: checkoutSigningId === null,
    variables: checkoutSigningId ? { checkoutSigningId } : undefined,
    pollInterval: 1000,
    async onCompleted(data) {
      const { status, completion } = data.checkoutSigning
      if (status === CheckoutSigningStatus.Signed && completion) {
        setCheckoutSigningId(null)
        // TODO: Handle errors
        console.debug('Congratulations, signing complete!', completion)
        const accessToken = await exchangeAuthorizationCode(completion.authorizationCode)
        deleteCookie(checkoutId)
        onSuccess(accessToken)
      }
    },
    onError(error) {
      datadogLogs.logger.warn('Checkout | SigningQuery | Failed to sign', { error })
    },
  })

  const [startSign, result] = useCheckoutStartSignMutation({
    variables: { checkoutId },
    onCompleted(data) {
      const { signing } = data.checkoutStartSign
      if (signing && !data.checkoutStartSign.userError) {
        setCheckoutSigningId(signing.id)
        setCookie(checkoutId, signing.id)
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
      loading: result.loading || Boolean(checkoutSigningId),
      signingStatus: queryResult.data?.checkoutSigning.status,
      userError: getMutationError(result, result.data?.checkoutStartSign),
    },
  ] as const
}
