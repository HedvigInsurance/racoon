import { datadogLogs } from '@datadog/browser-logs'
import { FormEventHandler } from 'react'
import {
  useHandleSignCheckout,
  Params as SignCheckoutParams,
} from '@/services/Checkout/useHandleSignCheckout'
import { UserErrors } from './CheckoutPage.types'
import { useUpdateContactDetails } from './useUpdateContactDetails'

type Params = SignCheckoutParams & {
  checkoutId: string
}

export const useHandleSubmitCheckout = (params: Params) => {
  const { checkoutId, checkoutSigningId, onSuccess } = params
  const [startSign, signResult] = useHandleSignCheckout({
    checkoutId,
    checkoutSigningId,
    onSuccess,
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

  const userErrors: UserErrors = {
    ...contactDetailsResult.userErrors,
    ...signResult.userErrors,
  }

  return [
    handleSubmit,
    {
      loading: signResult.loading || contactDetailsResult.loading,
      userErrors,
      signingStatus: signResult.signingStatus,
    },
  ] as const
}
