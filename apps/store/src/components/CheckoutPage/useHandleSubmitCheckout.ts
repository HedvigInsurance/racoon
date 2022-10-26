import { datadogLogs } from '@datadog/browser-logs'
import { FormEventHandler } from 'react'
import {
  useHandleSignCheckout,
  Params as SignCheckoutParams,
} from '@/services/Checkout/useHandleSignCheckout'
import { UserErrors } from './CheckoutPage.types'
import { useUpdateContactDetails } from './useUpdateContactDetails'
import { useUpdateStartDates, Params as StartDatesParams } from './useUpdateStartDates'

type Params = Omit<StartDatesParams, 'onSuccess'> &
  SignCheckoutParams & {
    checkoutId: string
  }

export const useHandleSubmitCheckout = (params: Params) => {
  const { checkoutId, checkoutSigningId, onSuccess, ...startDateParams } = params
  const [startSign, signResult] = useHandleSignCheckout({
    checkoutId,
    checkoutSigningId,
    onSuccess,
  })

  const [updateContactDetails, contactDetailsResult] = useUpdateContactDetails({
    checkoutId,
    onSuccess: startSign,
  })

  const [updateStartDates, startDatesResult] = useUpdateStartDates({
    ...startDateParams,
    onSuccess: updateContactDetails,
  })

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    datadogLogs.logger.debug('Checkout | Submit')
    const formData = new FormData(event.currentTarget)
    updateStartDates(formData)
  }

  const userErrors: UserErrors = {
    ...startDatesResult.userErrors,
    ...contactDetailsResult.userErrors,
    ...signResult.userErrors,
  }

  return [
    handleSubmit,
    {
      loading: signResult.loading || contactDetailsResult.loading || startDatesResult.loading,
      userErrors,
    },
  ] as const
}
