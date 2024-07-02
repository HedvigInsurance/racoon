import { startTransition, useCallback } from 'react'
import { usePriceIntentId } from '@/components/PriceCalculator/priceCalculatorAtoms'
import { useUpdatePriceIntent } from '@/components/PriceCalculator/useUpdatePriceIntent'
import type { JSONData } from '@/services/PriceCalculator/PriceCalculator.types'
import type { PriceIntent } from '@/services/priceIntent/priceIntent.types'
import type { ShopSession } from '@/services/shopSession/ShopSession.types'
import { useShopSessionId } from '@/services/shopSession/ShopSessionContext'

type Params = {
  onSuccess: (values: { priceIntent: PriceIntent; customer: ShopSession['customer'] }) => void
}

export const useHandleSubmitPriceCalculatorSection = (params: Params) => {
  const shopSessionId = useShopSessionId()!
  const priceIntentId = usePriceIntentId()
  const updatePriceIntent = useUpdatePriceIntent({ onSuccess: params.onSuccess })

  // NOTE: We probably want to refactor this in the future
  // and stop editing priceIntent and customer data as a mix.
  // We should do this when current solution becomes a problem
  const handleSubmitSection = useCallback(
    (data: JSONData) => {
      const [customerData, priceIntentData] = separateCustomerData(data)

      if (priceIntentData == null) {
        console.warn(
          'handleSubmitSection called without priceIntentData, this is not intended usage. ' +
            'Skipping priceIntentDataUpdate',
        )
        return
      }
      startTransition(() => {
        updatePriceIntent({
          variables: {
            priceIntentId,
            data: priceIntentData,
            customer: { shopSessionId, ...customerData },
          },
        })
      })
    },
    [priceIntentId, shopSessionId, updatePriceIntent],
  )

  return handleSubmitSection
}

const CUSTOMER_FIELDS = ['ssn', 'email']
const separateCustomerData = (data: JSONData) => {
  const customerData: JSONData = {}
  const priceIntentData: JSONData = {}

  Object.keys(data).forEach((key) => {
    if (CUSTOMER_FIELDS.includes(key)) {
      customerData[key] = data[key]
    } else {
      priceIntentData[key] = data[key]
    }
  })

  const customerDataIsEmpty = Object.keys(customerData).length === 0
  const priceIntentDataIsEmpty = Object.keys(priceIntentData).length === 0
  return [
    customerDataIsEmpty ? null : customerData,
    priceIntentDataIsEmpty ? null : priceIntentData,
  ] as const
}
