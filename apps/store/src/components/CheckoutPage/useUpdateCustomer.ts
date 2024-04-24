import { datadogLogs } from '@datadog/browser-logs'
import { useShopSessionCustomerUpdateMutation } from '@/services/graphql/generated'
import { useErrorMessage } from '@/utils/useErrorMessage'
import { FormElement } from './CheckoutPage.constants'

type Params = {
  shopSessionId: string
}

export const useUpdateCustomer = ({ shopSessionId }: Params) => {
  const [updateCustomer, result] = useShopSessionCustomerUpdateMutation({
    onError(error) {
      datadogLogs.logger.warn('Failed to update contact details', { error })
    },
  })

  const handleSubmit = (formData: FormData) => {
    datadogLogs.logger.debug('Checkout | Submit contact details')
    const email = formData.get(FormElement.Email) as string | null
    const firstName = formData.get(FormElement.FirstName) as string | null
    const lastName = formData.get(FormElement.LastName) as string | null
    return updateCustomer({
      variables: { input: { shopSessionId, email, firstName, lastName } },
    })
  }

  return [
    handleSubmit,
    {
      loading: result.loading,
      userError: useErrorMessage(result.error),
    },
  ] as const
}
