import { datadogLogs } from '@datadog/browser-logs'
import { FormEventHandler } from 'react'
import { ShopSessionAuthenticationStatus } from '@/services/apollo/generated'
import {
  Params as SignCheckoutParams,
  useHandleSignShopSession,
} from '@/services/Checkout/useHandleSignShopSession'
import { useUpdateCustomer } from './useUpdateCustomer'

type Params = SignCheckoutParams & {
  shopSessionId: string
  customerAuthenticationStatus:
    | ShopSessionAuthenticationStatus.Authenticated
    | ShopSessionAuthenticationStatus.None
}

export const useHandleSubmitCheckout = (params: Params) => {
  const { customerAuthenticationStatus, shopSessionId, shopSessionSigningId, onSuccess, onError } =
    params
  const [startSign, signResult] = useHandleSignShopSession({
    shopSessionId,
    shopSessionSigningId,
    onSuccess,
    onError,
  })

  const [updateCustomer, updateCustomerResult] = useUpdateCustomer({
    shopSessionId,
  })

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    datadogLogs.logger.debug('Checkout | Submit')
    if (customerAuthenticationStatus === ShopSessionAuthenticationStatus.None) {
      const formData = new FormData(event.currentTarget)
      await updateCustomer(formData)
    }
    await startSign()
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
