import { setCookie, deleteCookie } from 'cookies-next'
import { useState } from 'react'
import { useCheckoutSigningQuery, useCheckoutStartSignMutation } from '@/services/apollo/generated'
import { useHandleSubmitContactDetails } from './useHandleSubmitContactDetails'

type Params = {
  checkoutId: string
  checkoutSigningId: string | null
  onSuccess: (accessToken: string) => void
}

export const useHandleSubmitContactDetailsAndSign = (params: Params) => {
  const { checkoutId, checkoutSigningId: initialCheckoutSigningId, onSuccess } = params
  const [checkoutSigningId, setCheckoutSigningId] = useState(initialCheckoutSigningId)

  const { data } = useCheckoutSigningQuery({
    skip: checkoutSigningId === null,
    variables: checkoutSigningId ? { checkoutSigningId } : undefined,
    pollInterval: 1000,
    onCompleted(data) {
      // @TODO: investigate which status codes are sent from backend
      if (data.checkoutSigning.completion) {
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

  const [handleSubmit, { loading: loadingContactDetails }] = useHandleSubmitContactDetails({
    checkoutId,
    onSuccess: startSign,
  })

  const hasAccessToken = data?.checkoutSigning.completion
  const isLoading = Boolean(
    loadingContactDetails || loadingStartSign || checkoutSigningId || hasAccessToken,
  )
  return [handleSubmit, isLoading] as const
}
