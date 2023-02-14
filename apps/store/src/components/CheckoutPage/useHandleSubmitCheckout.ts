import { datadogLogs } from '@datadog/browser-logs'
import { useTranslation } from 'next-i18next'
import { FormEventHandler } from 'react'
import { ShopSessionAuthenticationStatus } from '@/services/apollo/generated'
import { BankIdState } from '@/services/bankId/bankId.types'
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
  const { customerAuthenticationStatus, shopSessionId, ssn, onSuccess } = options
  const [updateCustomer, updateCustomerResult] = useUpdateCustomer({ shopSessionId })

  const { currentOperation, startCheckoutSign } = useBankIdContext()

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    if (customerAuthenticationStatus === ShopSessionAuthenticationStatus.None) {
      datadogLogs.logger.debug('New member, updating customer data')
      const formData = new FormData(event.currentTarget)
      await updateCustomer(formData)
    }
    await startCheckoutSign({ customerAuthenticationStatus, shopSessionId, ssn, onSuccess })
  }

  let userError = updateCustomerResult.userError
  if (!userError && currentOperation?.error) {
    // TODO: Expose userError from API
    userError = { message: t('UNKNOWN_ERROR_MESSAGE') }
  }

  const signLoading = [BankIdState.Starting || BankIdState.Pending || BankIdState.Success].includes(
    currentOperation?.state as BankIdState,
  )

  return [
    handleSubmit,
    {
      loading: updateCustomerResult.loading || signLoading,
      userError,
    },
  ] as const
}
