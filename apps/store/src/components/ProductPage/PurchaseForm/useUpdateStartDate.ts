import { datadogLogs } from '@datadog/browser-logs'
import { useStartDateUpdateMutation } from '@/services/apollo/generated'
import { PriceIntent } from '@/services/priceIntent/priceIntent.types'
import { formatAPIDate } from '@/utils/date'
import { getMutationError } from '@/utils/getMutationError'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'

export type Params = {
  priceIntent: PriceIntent
}

export const useUpdateStartDate = ({ priceIntent }: Params) => {
  const [updateStartDate, result] = useStartDateUpdateMutation({
    onError(error) {
      datadogLogs.logger.warn('Failed to update start date', { error })
    },
  })
  const { locale } = useCurrentLocale()

  const productOfferIds = priceIntent.offers.map((item) => item.id)
  const saveStartDate = async ({
    dateValue,
    onSuccess,
  }: {
    dateValue: Date
    onSuccess?: () => void
  }) => {
    datadogLogs.logger.info('Update start date')
    updateStartDate({
      variables: { productOfferIds, startDate: formatAPIDate(dateValue), locale },
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
