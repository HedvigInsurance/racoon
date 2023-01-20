import { datadogLogs } from '@datadog/browser-logs'
import { FormEventHandler } from 'react'
import {
  useHandleSignShopSession,
  Params as SignCheckoutParams,
} from '@/services/Checkout/useHandleSignShopSession'
import { useUpdateCustomer } from './useUpdateCustomer'

type Params = SignCheckoutParams & {
  shopSessionId: string
}

export const useHandleSubmitCheckout = (params: Params) => {
  const { shopSessionId, shopSessionSigningId, onSuccess, onError } = params
  const [startSign, signResult] = useHandleSignShopSession({
    shopSessionId,
    shopSessionSigningId,
    onSuccess,
    onError,
  })

  const [updateCustomer, updateCustomerResult] = useUpdateCustomer({
    shopSessionId,
    // TODO: Move to handleSubmit, easier to read
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
