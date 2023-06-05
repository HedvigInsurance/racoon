import { datadogLogs } from '@datadog/browser-logs'
import { useStartDateUpdateMutation } from '@/services/apollo/generated'
import { PriceIntent } from '@/services/priceIntent/priceIntent.types'
import { formatAPIDate } from '@/utils/date'

export type Params = {
  priceIntent: PriceIntent
}

export const useUpdateStartDate = ({ priceIntent }: Params) => {
  const [updateStartDate, mutationResult] = useStartDateUpdateMutation({
    onError(error) {
      datadogLogs.logger.warn('Failed to update start date', { error })
    },
  })

  const productOfferIds = priceIntent.offers.map((item) => item.id)
  const saveStartDate = ({ dateValue, onSuccess }: { dateValue: Date; onSuccess?: () => void }) => {
    datadogLogs.logger.info('Update start date')
    updateStartDate({
      variables: { productOfferIds, startDate: formatAPIDate(dateValue) },
      onCompleted() {
        onSuccess?.()
      },
    })
  }

  return [saveStartDate, mutationResult] as const
}
