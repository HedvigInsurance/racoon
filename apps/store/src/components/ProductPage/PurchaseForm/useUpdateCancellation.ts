import { datadogLogs } from '@datadog/browser-logs'
import { usePriceIntentCancellationRequestedUpdateMutation } from '@/services/apollo/generated'
import { getMutationError } from '@/utils/getMutationError'

type Params = { priceIntentId: string }

export const useUpdateCancellation = ({ priceIntentId }: Params) => {
  const [updateCancellation, result] = usePriceIntentCancellationRequestedUpdateMutation()

  const handleUpdateCancellation = (requested: boolean) => {
    updateCancellation({
      variables: {
        priceIntentId,
        requested,
      },
      onError(error) {
        datadogLogs.logger.warn('Failed to update cancellation', { error })
      },
    })
  }

  return [
    handleUpdateCancellation,
    {
      loading: result.loading,
      userError: getMutationError(result, result.data?.priceIntentCancellationRequestedUpdate),
    },
  ] as const
}
