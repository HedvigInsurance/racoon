import { datadogLogs } from '@datadog/browser-logs'
import { useTranslation } from 'next-i18next'
import { FormEventHandler } from 'react'
import { ShopSessionAuthenticationStatus } from '@/services/apollo/generated'
import { useBankIdContext } from '@/services/bankId/BankIdContext'
import { useUpdateCustomer } from './useUpdateCustomer'

type Options = {
  shopSessionId: string
  ssn: string
  customerAuthenticationStatus: ShopSessionAuthenticationStatus
  onError: () => void
  onSuccess: () => void
}

export const useHandleSubmitCheckout = (options: Options) => {
  const { t } = useTranslation('common')
  const { customerAuthenticationStatus, shopSessionId, onError, onSuccess } = options
  const [updateCustomer, updateCustomerResult] = useUpdateCustomer({
    shopSessionId,
  })

  const { cancelCheckoutSign, startCheckoutSign, lastError } = useBankIdContext()

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    if (customerAuthenticationStatus === ShopSessionAuthenticationStatus.None) {
      datadogLogs.logger.debug('New member, updating customer data')
      const formData = new FormData(event.currentTarget)
      await updateCustomer(formData)
    }
    await startCheckoutSign({
      onSuccess,
      onError,
      onCancel: cancelCheckoutSign,
    })
  }

  let userError = updateCustomerResult.userError
  if (lastError) {
    const lastErrorMessage =
      (typeof lastError === 'object' && (lastError as Record<string, string>)?.message) ?? ''
    if (lastErrorMessage) {
      userError = { message: lastErrorMessage }
    } else {
      userError = { message: t('UNKNOWN_ERROR_MESSAGE') }
    }
  }

  return [
    handleSubmit,
    {
      loading: updateCustomerResult.loading,
      userError,
    },
  ] as const
}
