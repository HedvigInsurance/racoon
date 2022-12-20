import { datadogLogs } from '@datadog/browser-logs'
import { useCancellationRequestedUpdateMutation } from '@/services/apollo/generated'
import { PriceIntent } from '@/services/priceIntent/priceIntent.types'
import { getMutationError } from '@/utils/getMutationError'

type Params = { priceIntent: PriceIntent }

export const useUpdateCancellation = ({ priceIntent }: Params) => {
  const [updateCancellation, result] = useCancellationRequestedUpdateMutation()

  const handleUpdateCancellation = (requested: boolean) => {
    updateCancellation({
      variables: {
        productOfferIds: priceIntent.offers.map(({ id }) => id),
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
      userError: getMutationError(result, result.data?.productOffersCancellationRequestedUpdate),
    },
  ] as const
}
