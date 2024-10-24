import { datadogLogs } from '@datadog/browser-logs'
import { useTranslation } from 'next-i18next'
import type { FormEventHandler } from 'react'
import { BankIdState } from '@/services/bankId/bankId.types'
import { useBankIdContext } from '@/services/bankId/BankIdContext'
import { useShopSessionCustomerUpdateMutation } from '@/services/graphql/generated'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { useErrorMessage } from '@/utils/useErrorMessage'
import { FormElement } from '../CheckoutPage.constants'

type Options = {
  shopSessionId: string
  ssn: string
  onSuccess: () => void
  onError?: () => void
}

export function useHandleSubmitCheckout(options: Options) {
  const { t } = useTranslation('common')
  const { shopSessionId, ssn, onSuccess, onError } = options
  const [updateCustomer, updateCustomerResult] = useUpdateCustomer({ shopSessionId })
  const { currentOperation, startCheckoutSign } = useBankIdContext()
  const { shopSession } = useShopSession()

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()

    if ((shopSession?.customer?.missingFields ?? []).length > 0) {
      const formData = new FormData(event.currentTarget)
      await updateCustomer(formData)
    }

    startCheckoutSign({ shopSessionId, ssn, onSuccess, onError })
  }

  let userError = updateCustomerResult.userError
  if (!userError && currentOperation?.error) {
    userError = t('UNKNOWN_ERROR_MESSAGE')
  }

  let signLoading = false
  const { state: bankIdState } = currentOperation ?? {}
  if (bankIdState) {
    signLoading = [BankIdState.Starting, BankIdState.Pending, BankIdState.Success].includes(
      bankIdState,
    )
  }

  return [
    handleSubmit,
    {
      loading: updateCustomerResult.loading || signLoading,
      userError,
    },
  ] as const
}

function useUpdateCustomer({ shopSessionId }: { shopSessionId: string }) {
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
