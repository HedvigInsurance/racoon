import { datadogLogs } from '@datadog/browser-logs'
import { usePriceIntentDataUpdateMutation } from '@/services/apollo/generated'
import { JSONData } from '@/services/PriceCalculator/PriceCalculator.types'
import { PriceIntent } from '@/services/priceIntent/priceIntent.types'

type Params = {
  priceIntent: PriceIntent
  onSuccess: (priceIntent: PriceIntent) => void
}

export const useHandleSubmitPriceCalculator = ({ onSuccess, priceIntent }: Params) => {
  const [updateData, { loading }] = usePriceIntentDataUpdateMutation()

  const handleSubmit = async (data: JSONData) => {
    try {
      return await updateData({ variables: { priceIntentId: priceIntent.id, data } })
    } catch (error) {
      datadogLogs.logger.error("Couldn't update price intent", {
        error,
        priceIntentId: priceIntent.id,
      })
    }
  }

  const handleSubmitSection = async (data: JSONData) => {
    const result = await handleSubmit(data)
    const updatedPriceIntent = result?.data?.priceIntentDataUpdate.priceIntent
    if (updatedPriceIntent) {
      onSuccess(updatedPriceIntent)
    }
  }

  return [handleSubmit, handleSubmitSection, loading] as const
}
