import { datadogLogs } from '@datadog/browser-logs'
import { deleteCookie, setCookie } from 'cookies-next'
import { useState } from 'react'
import {
  CheckoutSigningStatus,
  CheckoutStartSignMutationResult,
  useCheckoutSigningQuery,
  useCheckoutStartSignMutation,
} from '@/services/apollo/generated'
import { exchangeAuthorizationCode } from '@/utils/oauth'

export type Params = {
  checkoutId: string
  checkoutSigningId: string | null
  onSuccess: (accessToken: string) => void
}

export const useHandleSignCheckout = (params: Params) => {
  const { checkoutId, checkoutSigningId: initialCheckoutSigningId, onSuccess } = params
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
  })

  const [startSign, result] = useCheckoutStartSignMutation({
    variables: { checkoutId },
    onCompleted(data) {
      const { signing } = data.checkoutStartSign
      if (signing && data.checkoutStartSign.userErrors.length === 0) {
        setCheckoutSigningId(signing.id)
        setCookie(checkoutId, signing.id)
      }
    },
    onError(error) {
      datadogLogs.logger.warn('Checkout | Failed to sign', { error })
    },
  })

  return [
    startSign,
    {
      loading: result.loading || Boolean(checkoutSigningId),
      signingStatus: queryResult.data?.checkoutSigning.status,
      userErrors: getErrors(result),
    },
  ] as const
}

const getErrors = (result: CheckoutStartSignMutationResult) => {
  if (result.error) {
    return { form: 'Something went wrong' }
  }
  const userErrors = result.data?.checkoutStartSign.userErrors ?? []
  if (userErrors.length > 0) {
    return { form: userErrors.map((error) => error.message).join('; ') }
  }
}
