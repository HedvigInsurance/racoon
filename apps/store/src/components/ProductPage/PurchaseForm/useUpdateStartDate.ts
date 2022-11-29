import { datadogLogs } from '@datadog/browser-logs'
import { useStartDateUpdateMutation } from '@/services/apollo/generated'
import { formatAPIDate } from '@/utils/date'
import { getMutationError } from '@/utils/getMutationError'

export type Params = {
  priceIntentId: string
}

export const useUpdateStartDate = ({ priceIntentId }: Params) => {
  const [updateStartDate, result] = useStartDateUpdateMutation({
    onError(error) {
      datadogLogs.logger.warn('Failed to update start date', { error })
    },
  })

  const saveStartDate = async ({
    dateValue,
    onSuccess,
  }: {
    dateValue: Date
    onSuccess?: () => void
  }) => {
    datadogLogs.logger.info('Update start date')
    updateStartDate({
      variables: { priceIntentId, startDate: formatAPIDate(dateValue) },
      onCompleted(data) {
        if (!data.priceIntentStartDateUpdate.userError) {
          onSuccess?.()
        }
      },
    })
  }

  return [
    saveStartDate,
    {
      loading: result.loading,
      userError: getMutationError(result, result.data?.priceIntentStartDateUpdate),
    },
  ] as const
}
