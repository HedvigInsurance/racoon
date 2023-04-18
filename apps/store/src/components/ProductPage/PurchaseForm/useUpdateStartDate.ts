import { datadogLogs } from '@datadog/browser-logs'
import { useStartDateUpdateMutation } from '@/services/apollo/generated'
import { PriceIntent } from '@/services/priceIntent/priceIntent.types'
import { formatAPIDate } from '@/utils/date'
import { useGetMutationError } from '@/utils/useGetMutationError'

export type Params = {
  priceIntent: PriceIntent
}

export const useUpdateStartDate = ({ priceIntent }: Params) => {
  const getMutationError = useGetMutationError()
  const [updateStartDate, result] = useStartDateUpdateMutation({
    onError(error) {
      datadogLogs.logger.warn('Failed to update start date', { error })
    },
  })

  const productOfferIds = priceIntent.offers.map((item) => item.id)
  const saveStartDate = ({ dateValue, onSuccess }: { dateValue: Date; onSuccess?: () => void }) => {
    datadogLogs.logger.info('Update start date')
    updateStartDate({
      variables: { productOfferIds, startDate: formatAPIDate(dateValue) },
      onCompleted(data) {
        if (!data.productOffersStartDateUpdate.userError) {
          onSuccess?.()
        }
      },
    })
  }

  return [
    saveStartDate,
    {
      loading: result.loading,
      userError: getMutationError(result, result.data?.productOffersStartDateUpdate),
    },
  ] as const
}
