import { datadogLogs } from '@datadog/browser-logs'
import { useContactDetailsUpdateMutation } from '@/services/apollo/generated'
import { getMutationError } from '@/utils/getMutationError'
import { getOrThrowFormValue } from '@/utils/getOrThrowFormValue'
import { FormElement } from './CheckoutPage.constants'

type Params = {
  checkoutId: string
  onSuccess: () => void
}

export const useUpdateContactDetails = ({ checkoutId, onSuccess }: Params) => {
  const [updateContactDetails, result] = useContactDetailsUpdateMutation({
    onCompleted(data) {
      if (!data.checkoutContactDetailsUpdate.userError) {
        onSuccess()
      }
    },
    onError(error) {
      datadogLogs.logger.warn('Failed to update contact details', { error })
    },
  })

  const handleSubmit = async (formData: FormData) => {
    datadogLogs.logger.debug('Checkout | Submit contact details')
    const email = getOrThrowFormValue(formData, FormElement.Email)
    const firstName = getOrThrowFormValue(formData, FormElement.FirstName)
    const lastName = getOrThrowFormValue(formData, FormElement.LastName)
    const personalNumber = getOrThrowFormValue(formData, FormElement.PersonalNumber)
    const phoneNumber = getOrThrowFormValue(formData, FormElement.PhoneNumber)
    updateContactDetails({
      variables: {
        input: { checkoutId, email, firstName, lastName, personalNumber, phoneNumber },
      },
    })
  }

  return [
    handleSubmit,
    {
      loading: result.loading,
      userError: getMutationError(result, result.data?.checkoutContactDetailsUpdate),
    },
  ] as const
}
