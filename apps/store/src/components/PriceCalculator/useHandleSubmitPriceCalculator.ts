import { datadogLogs } from '@datadog/browser-logs'
import {
  usePriceIntentDataUpdateMutation,
  useShopSessionCustomerUpdateMutation,
} from '@/services/apollo/generated'
import { JSONData } from '@/services/PriceCalculator/PriceCalculator.types'
import { PriceIntent } from '@/services/priceIntent/priceIntent.types'

type Params = {
  shopSessionId: string
  priceIntent: PriceIntent
  onSuccess: (priceIntent: PriceIntent) => void
}

export const useHandleSubmitPriceCalculator = ({
  shopSessionId,
  priceIntent,
  onSuccess,
}: Params) => {
  const [updateData, { loading: loadingData }] = usePriceIntentDataUpdateMutation({
    onCompleted: (data) => {
      if (data.priceIntentDataUpdate.priceIntent) {
        onSuccess(data.priceIntentDataUpdate.priceIntent)
      }
    },
    onError(error) {
      datadogLogs.logger.error("Couldn't update price intent", {
        error,
        priceIntentId: priceIntent.id,
      })
    },
  })
  const [updateCustomer, { loading: loadingCustomer }] = useShopSessionCustomerUpdateMutation({
    onCompleted: (data) => {
      if (data.shopSessionCustomerUpdate.shopSession) {
        onSuccess(priceIntent)
      }
    },
  })

  const handleSubmit = async (data: JSONData) => {
    return await updateData({ variables: { priceIntentId: priceIntent.id, data } })
  }

  const handleSubmitSection = async (data: JSONData) => {
    const [customerData, priceIntentData] = separateCustomerData(data)

    if (customerData) {
      updateCustomer({ variables: { input: { shopSessionId, ...customerData } } })
    }

    if (priceIntentData) {
      updateData({ variables: { priceIntentId: priceIntent.id, data: priceIntentData } })
    }
  }

  const loading = loadingData || loadingCustomer
  return [handleSubmit, handleSubmitSection, loading] as const
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
