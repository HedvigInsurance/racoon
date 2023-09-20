import { type ApolloError } from '@apollo/client'
import { useTranslation } from 'next-i18next'
import {
  usePriceIntentConfirmMutation,
  usePriceIntentDataUpdateCarMutation,
} from '@/services/apollo/generated'
import { useAppErrorHandleContext } from '@/services/appErrors/AppErrorContext'

type EditAndConfirmParams = {
  priceIntentId: string
  onCompleted: () => void
}

export const useEditAndConfirm = (params: EditAndConfirmParams) => {
  const { t } = useTranslation('common')
  const { showError } = useAppErrorHandleContext()

  const [confirm, confirmResult] = usePriceIntentConfirmMutation({
    variables: { priceIntentId: params.priceIntentId },
    onCompleted() {
      params.onCompleted()
    },
  })

  const handleError = (error: ApolloError) => {
    console.warn('EditAndConfirm error', error)
    showError(new Error(t('UNKNOWN_ERROR_MESSAGE')))
    params.onCompleted()
  }

  const [updateData, updateResult] = usePriceIntentDataUpdateCarMutation({
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
      },
      onError: handleError,
    })
  }

  const loading = updateResult.loading || confirmResult.loading

  return [editAndConfirm, loading] as const
}
