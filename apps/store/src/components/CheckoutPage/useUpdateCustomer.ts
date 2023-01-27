import { datadogLogs } from '@datadog/browser-logs'
import { useShopSessionCustomerUpdateMutation } from '@/services/apollo/generated'
import { getOrThrowFormValue } from '@/utils/getOrThrowFormValue'
import { useGetMutationError } from '@/utils/useGetMutationError'
import { FormElement } from './CheckoutPage.constants'

type Params = {
  shopSessionId: string
  onSuccess?: () => void
}

export const useUpdateCustomer = ({ shopSessionId, onSuccess }: Params) => {
  const getMutationError = useGetMutationError()
  const [updateCustomer, result] = useShopSessionCustomerUpdateMutation({
    onCompleted(data) {
      if (!data.shopSessionCustomerUpdate.userError) {
        onSuccess?.()
      }
    },
    onError(error) {
      datadogLogs.logger.warn('Failed to update contact details', { error })
    },
  })

  const handleSubmit = async (formData: FormData) => {
    datadogLogs.logger.debug('Checkout | Submit contact details')
    const email = getOrThrowFormValue(formData, FormElement.Email)
    const firstName = formData.get(FormElement.FirstName) as string | null
    const lastName = formData.get(FormElement.LastName) as string | null
    updateCustomer({
      variables: { input: { shopSessionId, email, firstName, lastName } },
    })
  }

  return [
    handleSubmit,
    {
      loading: result.loading,
      userError: getMutationError(result, result.data?.shopSessionCustomerUpdate),
    },
  ] as const
}
