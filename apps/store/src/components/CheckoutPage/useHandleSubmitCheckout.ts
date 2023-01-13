import { datadogLogs } from '@datadog/browser-logs'
import { FormEventHandler } from 'react'
import {
  useHandleSignCheckout,
  Params as SignCheckoutParams,
} from '@/services/Checkout/useHandleSignCheckout'
import { useUpdateCustomer } from './useUpdateCustomer'

type Params = SignCheckoutParams & {
  shopSessionId: string
  checkoutId: string
}

export const useHandleSubmitCheckout = (params: Params) => {
  const { shopSessionId, checkoutId, checkoutSigningId, onSuccess, onError } = params
  const [startSign, signResult] = useHandleSignCheckout({
    checkoutId,
    checkoutSigningId,
    onSuccess,
    onError,
  })

  const [updateCustomer, updateCustomerResult] = useUpdateCustomer({
    shopSessionId,
    onSuccess: startSign,
  })

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    datadogLogs.logger.debug('Checkout | Submit')
    const formData = new FormData(event.currentTarget)
    updateCustomer(formData)
  }

  const userError = updateCustomerResult.userError || signResult.userError

  return [
    handleSubmit,
    {
      loading: signResult.loading || updateCustomerResult.loading,
      userError,
      signingStatus: signResult.signingStatus,
    },
  ] as const
}
