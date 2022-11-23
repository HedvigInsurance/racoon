import { datadogLogs } from '@datadog/browser-logs'
import { useStartDateUpdateMutation } from '@/services/apollo/generated'
import { convertToDate, formatAPIDate } from '@/utils/date'

export type Params = {
  cartId: string
  offerId: string
  onSuccess: () => void
}

export const useUpdateStartDate = ({ cartId, offerId, onSuccess }: Params) => {
  const [updateStartDate, result] = useStartDateUpdateMutation({
    onError(error) {
      datadogLogs.logger.warn('Failed to update start date', { error })
    },
  })

  const handleUpdateStartDate = async (dateValue: string | null) => {
    datadogLogs.logger.info('Update start date')

    const date = convertToDate(dateValue)

    if (!date) {
      datadogLogs.logger.warn('Unable to update start date', { offerId, dateValue })
      throw new Error(`Invalid date value for ${offerId}`)
    }

    updateStartDate({
      variables: { input: { cartId, updates: [{ offerId, startDate: formatAPIDate(date) }] } },
      onCompleted(data) {
        if (data.cartEntriesStartDateUpdate.userErrors.length === 0) {
          onSuccess()
        }
      },
    })
  }

  let userError: { message: string } | null = null
  if (result.error) {
    userError = { message: 'Something went wrong' }
  } else {
    const error = result.data?.cartEntriesStartDateUpdate.userErrors.find(
      (error) => error.offerId === offerId,
    )
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
