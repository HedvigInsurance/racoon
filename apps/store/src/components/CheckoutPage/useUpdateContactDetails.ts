import { datadogLogs } from '@datadog/browser-logs'
import { useContactDetailsUpdateMutation } from '@/services/apollo/generated'
import { getOrThrowFormValue } from '@/utils/getOrThrowFormValue'
import { FormElement } from './CheckoutPage.constants'
import { UserErrors } from './CheckoutPage.types'

const DEFAULT_INPUT = {
  personalNumber: '',
  firstName: '',
  lastName: '',
}

type Params = {
  checkoutId: string
  onSuccess: () => void
}

export const useUpdateContactDetails = ({ checkoutId, onSuccess }: Params) => {
  const [updateContactDetails, result] = useContactDetailsUpdateMutation({
    onCompleted(data) {
      if (data.checkoutContactDetailsUpdate.userErrors.length === 0) {
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
    updateContactDetails({
      variables: {
        input: { checkoutId, email, ...DEFAULT_INPUT },
      },
    })
  }

  const userErrors: UserErrors = {
    ...(result.error && { form: 'Something went wrong' }),
    ...result.data?.checkoutContactDetailsUpdate.userErrors.reduce((errors, error) => {
      const key = error.field?.join('.') ?? 'form'
      return {
        ...errors,
        [key]: error.message,
      }
    }, {}),
  }

  return [
    handleSubmit,
    {
      loading: result.loading,
      userErrors,
    },
  ] as const
}
