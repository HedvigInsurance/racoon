import { type ApolloError } from '@apollo/client'
import { useTranslation } from 'next-i18next'
import {
  usePriceIntentConfirmMutation,
  usePriceIntentDataUpdateMutation,
} from '@/services/apollo/generated'
import { useAppErrorHandleContext } from '@/services/appErrors/AppErrorContext'
import { PriceIntent } from '@/services/priceIntent/priceIntent.types'

type EditAndConfirmParams = {
  shopSessionId: string
  priceIntentId: string

  onCompleted: (priceIntent: PriceIntent) => void
}

export const useEditAndConfirm = (params: EditAndConfirmParams) => {
  const { t } = useTranslation('common')
  const { showError } = useAppErrorHandleContext()

  const [confirm, confirmResult] = usePriceIntentConfirmMutation({
    variables: { priceIntentId: params.priceIntentId },
    onCompleted(data) {
      const priceIntent = data.priceIntentConfirm.priceIntent
      if (priceIntent) {
        params.onCompleted(priceIntent)
      }
    },
  })

  const handleError = (error: ApolloError) => {
    console.warn('EditAndConfirm error', error)
    showError(new Error(t('UNKNOWN_ERROR_MESSAGE')))
  }

  const [updateData, updateResult] = usePriceIntentDataUpdateMutation({
    onCompleted() {
      confirm()
    },
    onError: handleError,
  })

  const editAndConfirm = (data: Record<string, unknown>) => {
    updateData({
      variables: {
        priceIntentId: params.priceIntentId,
        data,
        customer: { shopSessionId: params.shopSessionId },
      },
      onError: handleError,
    })
  }

  const loading = updateResult.loading || confirmResult.loading

  return [editAndConfirm, loading] as const
}
