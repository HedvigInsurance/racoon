import { setCookie, deleteCookie } from 'cookies-next'
import { useState } from 'react'
import {
  CheckoutSigningStatus,
  useCheckoutSigningQuery,
  useCheckoutStartSignMutation,
} from '@/services/apollo/generated'

type Params = {
  checkoutId: string
  checkoutSigningId: string | null
  onSuccess: (accessToken: string) => void
}

export const useHandleSignCheckout = (params: Params) => {
  const { checkoutId, checkoutSigningId: initialCheckoutSigningId, onSuccess } = params
  const [checkoutSigningId, setCheckoutSigningId] = useState(initialCheckoutSigningId)

  useCheckoutSigningQuery({
    skip: checkoutSigningId === null,
    variables: checkoutSigningId ? { checkoutSigningId } : undefined,
    pollInterval: 1000,
    onCompleted(data) {
      const isSigned = data.checkoutSigning.status === CheckoutSigningStatus.Signed
      if (isSigned && data.checkoutSigning.completion) {
        onSuccess(data.checkoutSigning.completion.accessToken)

        setCheckoutSigningId(null)
        deleteCookie(checkoutId)
      }
    },
  })

  const [startSign, { loading: loadingStartSign }] = useCheckoutStartSignMutation({
    variables: { checkoutId },
    onCompleted(data) {
      setCheckoutSigningId(data.checkoutStartSign.signing.id)
      setCookie(checkoutId, data.checkoutStartSign.signing.id)
    },
  })

  const isLoading = Boolean(loadingStartSign || checkoutSigningId)
  return [startSign, isLoading] as const
}
