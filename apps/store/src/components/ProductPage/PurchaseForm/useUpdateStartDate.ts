import { datadogLogs } from '@datadog/browser-logs'
import { useStartDateUpdateMutation } from '@/services/apollo/generated'
import { formatAPIDate } from '@/utils/date'

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
        if (data.priceIntentStartDateUpdate.userErrors.length === 0) {
          onSuccess?.()
        }
      },
    })
  }

  let userError: { message: string } | null = null
  if (result.error) {
    userError = { message: 'Something went wrong' }
  } else {
    // TODO: Handle multiple errors
    const error = result.data?.priceIntentStartDateUpdate.userErrors[0]
    if (error) {
      userError = { message: error.message }
    }
  }

  return [
    saveStartDate,
    {
      loading: result.loading,
      userError,
    },
  ] as const
}
