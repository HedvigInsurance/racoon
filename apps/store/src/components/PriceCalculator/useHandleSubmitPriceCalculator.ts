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
    const result = await updateData({ variables: { priceIntentId: priceIntent.id, data } })

    const updatedPriceIntent = result.data?.priceIntentDataUpdate.priceIntent
    if (updatedPriceIntent) {
      onSuccess(updatedPriceIntent)
    }
  }

  return [handleSubmit, loading] as const
}
