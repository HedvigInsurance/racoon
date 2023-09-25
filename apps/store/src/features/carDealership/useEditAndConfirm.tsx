import { type ApolloError } from '@apollo/client'
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
  const { showError } = useAppErrorHandleContext()

  const handleError = (error: ApolloError) => {
    showError(error)
    params.onCompleted()
  }

  const [confirm, confirmResult] = usePriceIntentConfirmMutation({
    variables: { priceIntentId: params.priceIntentId },
    onCompleted() {
      params.onCompleted()
    },
    onError: handleError,
  })

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
    })
  }

  const loading = updateResult.loading || confirmResult.loading

  return [editAndConfirm, loading] as const
}
