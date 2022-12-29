import { datadogLogs } from '@datadog/browser-logs'
import { FormEventHandler } from 'react'
import {
  useHandleSignCheckout,
  Params as SignCheckoutParams,
} from '@/services/Checkout/useHandleSignCheckout'
import { useUpdateContactDetails } from './useUpdateContactDetails'

type Params = SignCheckoutParams & {
  checkoutId: string
}

export const useHandleSubmitCheckout = (params: Params) => {
  const { checkoutId, checkoutSigningId, onSuccess, onError } = params
  const [startSign, signResult] = useHandleSignCheckout({
    checkoutId,
    checkoutSigningId,
    onSuccess,
    onError,
  })

  const [updateContactDetails, contactDetailsResult] = useUpdateContactDetails({
    checkoutId,
    onSuccess: startSign,
  })

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    datadogLogs.logger.debug('Checkout | Submit')
    const formData = new FormData(event.currentTarget)
    updateContactDetails(formData)
  }

  const userError = contactDetailsResult.userError || signResult.userError

  return [
    handleSubmit,
    {
      loading: signResult.loading || contactDetailsResult.loading,
      userError,
      signingStatus: signResult.signingStatus,
    },
  ] as const
}
