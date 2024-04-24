import { useTranslation } from 'next-i18next'
import type { FormEventHandler } from 'react'
import { BankIdState } from '@/services/bankId/bankId.types'
import { useBankIdContext } from '@/services/bankId/BankIdContext'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { useUpdateCustomer } from './useUpdateCustomer'

type Options = {
  shopSessionId: string
  ssn: string
  onError: () => void
  onSuccess: () => void
}

export const useHandleSubmitCheckout = (options: Options) => {
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
