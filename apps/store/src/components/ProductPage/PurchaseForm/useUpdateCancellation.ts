import { datadogLogs } from '@datadog/browser-logs'
import { usePriceIntentCancellationRequestedUpdateMutation } from '@/services/apollo/generated'
import { getMutationError } from '@/utils/getMutationError'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'

type Params = { priceIntentId: string }

export const useUpdateCancellation = ({ priceIntentId }: Params) => {
  const [updateCancellation, result] = usePriceIntentCancellationRequestedUpdateMutation()
  const { locale } = useCurrentLocale()

  const handleUpdateCancellation = (requested: boolean) => {
    updateCancellation({
      variables: {
        priceIntentId,
        requested,
        locale,
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
