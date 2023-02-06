import { datadogLogs } from '@datadog/browser-logs'
import { useRenewalDateUpdateMutation } from '@/services/apollo/generated'
import { PriceIntent } from '@/services/priceIntent/priceIntent.types'
import { formatAPIDate } from '@/utils/date'
import { useGetMutationError } from '@/utils/useGetMutationError'

export type Params = {
  priceIntent: PriceIntent
}

export const useUpdateRenewalDate = ({ priceIntent }: Params) => {
  const getMutationError = useGetMutationError()
  const [updateRenewalDate, result] = useRenewalDateUpdateMutation({
    onError(error) {
      datadogLogs.logger.warn('Failed to update renewal date', { error })
    },
  })

  const productOfferIds = priceIntent.offers.map((item) => item.id)
  const saveRenewalDate = async ({
    dateValue,
    onSuccess,
  }: {
    dateValue: Date
    onSuccess?: () => void
  }) => {
    datadogLogs.logger.info('Update start date')
    updateRenewalDate({
      variables: { productOfferIds, renewalDate: formatAPIDate(dateValue) },
      onCompleted(data) {
        if (!data.productOffersExistingInsuranceRenewalDateUpdate.userError) {
          onSuccess?.()
        }
      },
    })
  }

  return [
    saveRenewalDate,
    {
      loading: result.loading,
      userError: getMutationError(
        result,
        result.data?.productOffersExistingInsuranceRenewalDateUpdate,
      ),
    },
  ] as const
}
