import { datadogLogs } from '@datadog/browser-logs'
import { deleteCookie, setCookie } from 'cookies-next'
import { useState } from 'react'
import {
  CheckoutSigningStatus,
  CheckoutStartSignMutationResult,
  useCheckoutSigningQuery,
  useCheckoutStartSignMutation,
} from '@/services/apollo/generated'

export type Params = {
  checkoutId: string
  checkoutSigningId: string | null
  onSuccess: (accessToken: string) => void
}

export const useHandleSignCheckout = (params: Params) => {
  // eslint-disable-next-line
  const { checkoutId, checkoutSigningId: initialCheckoutSigningId, onSuccess } = params
  const [checkoutSigningId, setCheckoutSigningId] = useState(initialCheckoutSigningId)
  const [signingStatus, setSigningStatus] = useState<CheckoutSigningStatus | undefined>()

  useCheckoutSigningQuery({
    skip: checkoutSigningId === null,
    variables: checkoutSigningId ? { checkoutSigningId } : undefined,
    pollInterval: 1000,
    onCompleted(data) {
      const { status, completion } = data.checkoutSigning
      console.debug('Polling signing status', status)
      setSigningStatus(status)
      if (status === CheckoutSigningStatus.Signed && completion) {
        console.log('Congratulations, signing complete!  To be continued in next PR', completion)
        // TODO: Exchange authorizationCode to accessToken
        // onSuccess(data.checkoutSigning.completion.accessToken)

        setCheckoutSigningId(null)
        deleteCookie(checkoutId)
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
      signingStatus,
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
