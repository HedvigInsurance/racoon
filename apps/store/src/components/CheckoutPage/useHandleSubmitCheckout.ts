import { datadogLogs } from '@datadog/browser-logs'
import { FormEventHandler } from 'react'
import { ShopSessionAuthenticationStatus } from '@/services/apollo/generated'
import { useBankIdContext } from '@/services/bankId/BankIdContext'
import { Options as SignCheckoutParams } from '@/services/bankId/useBankIdCheckoutSign'
import { useUpdateCustomer } from './useUpdateCustomer'

type Options = Omit<SignCheckoutParams, 'onCancel' | 'onStateChange'> & {
  ssn: string
  customerAuthenticationStatus: ShopSessionAuthenticationStatus
}

export const useHandleSubmitCheckout = (options: Options) => {
  const { customerAuthenticationStatus, shopSessionId, onSuccess, onError } = options
  const [updateCustomer, updateCustomerResult] = useUpdateCustomer({
    shopSessionId,
  })

  const { startCheckoutSign } = useBankIdContext()
  const handleCancel = () => {
    console.debug('TODO: Handle cancel sign')
  }

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
      onCancel: handleCancel,
    })
  }

  const userError = updateCustomerResult.userError

  return [
    handleSubmit,
    {
      loading: updateCustomerResult.loading,
      userError,
    },
  ] as const
}
