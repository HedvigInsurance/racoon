import { datadogLogs } from '@datadog/browser-logs'
import { usePriceIntentCancellationRequestedUpdateMutation } from '@/services/apollo/generated'

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

  // TODO: Extract boilerplate to some util module.  Localize generic error
  let userError = null
  if (result.error) {
    userError = { message: 'Something went wrong' }
  } else {
    const error = result.data?.priceIntentCancellationRequestedUpdate.userErrors[0]
    if (error) {
      userError = { message: error.message }
    }
  }

  return [
    handleUpdateCancellation,
    {
      loading: result.loading,
      userError,
    },
  ] as const
}
