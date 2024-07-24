import { type ApolloError } from '@apollo/client'
import { useShowAppError } from '@/services/appErrors/appErrorAtom'
import {
  usePriceIntentConfirmMutation,
  usePriceIntentDataUpdateCarMutation,
} from '@/services/graphql/generated'

type EditAndConfirmParams = {
  priceIntentId: string
  onCompleted: () => void
}

export const useEditAndConfirm = (params: EditAndConfirmParams) => {
  const showError = useShowAppError()

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
