import { datadogLogs } from '@datadog/browser-logs'
import { deleteCookie, setCookie } from 'cookies-next'
import { useState } from 'react'
import {
  CheckoutSigningStatus,
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
      } else {
        console.error('Got userErrors', data.checkoutStartSign.userErrors)
      }
    },
    onError(error) {
      datadogLogs.logger.warn('Checkout | Failed to sign', { error })
    },
  })

  const userErrors = {
    ...(result.error && { form: 'Something went wrong' }),
  }

  return [
    startSign,
    {
      loading: result.loading || Boolean(checkoutSigningId),
      signingStatus,
      userErrors,
    },
  ] as const
}
