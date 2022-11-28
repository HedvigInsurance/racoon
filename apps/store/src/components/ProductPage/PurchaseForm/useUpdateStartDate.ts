import { datadogLogs } from '@datadog/browser-logs'
import { useStartDateUpdateMutation } from '@/services/apollo/generated'
import { convertToDate, formatAPIDate } from '@/utils/date'

export type Params = {
  priceIntentId: string
}

export const useUpdateStartDate = ({ priceIntentId }: Params) => {
  const [updateStartDate, result] = useStartDateUpdateMutation({
    onError(error) {
      datadogLogs.logger.warn('Failed to update start date', { error })
    },
  })

  // TODO: Improve this name, it's not event handler
  const handleUpdateStartDate = async ({
    dateValue,
    onSuccess,
  }: {
    offerId: string
    dateValue: string | null
    onSuccess: () => void
  }) => {
    datadogLogs.logger.info('Update start date')

    const date = convertToDate(dateValue)

    if (!date) {
      datadogLogs.logger.warn('Unable to update start date', {
        priceIntentId,
        dateValue,
      })
      throw new Error(`Invalid date value for ${priceIntentId}`)
    }

    updateStartDate({
      variables: { priceIntentId, startDate: formatAPIDate(date) },
      onCompleted(data) {
        if (data.priceIntentStartDateUpdate.userErrors.length === 0) {
          onSuccess()
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
    handleUpdateStartDate,
    {
      loading: result.loading,
      userError,
    },
  ] as const
}
