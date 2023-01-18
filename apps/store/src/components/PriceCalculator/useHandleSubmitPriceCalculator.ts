import { datadogLogs } from '@datadog/browser-logs'
import { usePriceIntent } from '@/components/ProductPage/PriceIntentContext'
import {
  usePriceIntentDataUpdateMutation,
  useShopSessionCustomerUpdateMutation,
} from '@/services/apollo/generated'
import { JSONData } from '@/services/PriceCalculator/PriceCalculator.types'
import { PriceIntent } from '@/services/priceIntent/priceIntent.types'
import { ShopSession } from '@/services/shopSession/ShopSession.types'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'

type Params = {
  onSuccess: (values: { priceIntent: PriceIntent; customer: ShopSession['customer'] }) => void
}

export const useHandleSubmitPriceCalculator = ({ onSuccess }: Params) => {
  const { shopSession } = useShopSession()
  const [{ priceIntent }] = usePriceIntent()
  const [updateData, { loading: loadingData }] = usePriceIntentDataUpdateMutation({
    onCompleted: (data) => {
      const { priceIntent } = data.priceIntentDataUpdate
      if (shopSession && priceIntent) {
        onSuccess({ priceIntent, customer: shopSession.customer })
      }
    },
    onError(error) {
      datadogLogs.logger.error("Couldn't update price intent", {
        error,
        priceIntentId: priceIntent?.id,
      })
    },
  })
  const [updateCustomer, { loading: loadingCustomer }] = useShopSessionCustomerUpdateMutation({
    // priceIntent.suggestedData may be updated based on customer.ssn
    refetchQueries: 'active',
    awaitRefetchQueries: true,
    onCompleted: (data) => {
      const { shopSession } = data.shopSessionCustomerUpdate
      if (shopSession && priceIntent) {
        onSuccess({ priceIntent, customer: shopSession.customer })
      }
    },
  })

  const handleSubmit = async (data: JSONData) => {
    const [customerData, priceIntentData] = separateCustomerData(data)
    if (customerData) {
      throw new Error('Submitting customer data out of section is not supported')
    }
    return await updateData({
      variables: { priceIntentId: priceIntent!.id, data: priceIntentData },
    })
  }

  // NOTE: We probably want to refactor this in the future and stop editing priceIntent and customer data as a mix
  // We should either refactor this
  // - when we support Denmark / Norway
  // - when current solution becomes a problem
  const handleSubmitSection = async (data: JSONData) => {
    if (!shopSession || !priceIntent) throw new Error('Not enough data to submit price calculator')
    const [customerData, priceIntentData] = separateCustomerData(data)

    // Intentionally not waiting for responses since we can handle any order of updates
    if (customerData) {
      updateCustomer({ variables: { input: { shopSessionId: shopSession.id, ...customerData } } })
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
