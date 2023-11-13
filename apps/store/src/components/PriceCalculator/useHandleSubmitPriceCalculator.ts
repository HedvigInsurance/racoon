import { datadogLogs } from '@datadog/browser-logs'
import { useTranslation } from 'next-i18next'
import { usePriceIntent } from '@/components/ProductPage/PriceIntentContext'
import { usePriceIntentDataUpdateMutation } from '@/services/apollo/generated'
import { useAppErrorHandleContext } from '@/services/appErrors/AppErrorContext'
import { JSONData } from '@/services/PriceCalculator/PriceCalculator.types'
import { PriceIntent } from '@/services/priceIntent/priceIntent.types'
import { ShopSession } from '@/services/shopSession/ShopSession.types'

type Params = {
  shopSession: ShopSession
  onSuccess: (values: { priceIntent: PriceIntent; customer: ShopSession['customer'] }) => void
}

export const useHandleSubmitPriceCalculator = (params: Params) => {
  const [priceIntent] = usePriceIntent()
  const { t } = useTranslation('purchase-form')
  const { showError } = useAppErrorHandleContext()
  const [updateData, { loading }] = usePriceIntentDataUpdateMutation({
    // priceIntent.suggestedData may be updated based on customer.ssn
    refetchQueries: 'active',
    awaitRefetchQueries: true,
    onCompleted: (data) => {
      const { priceIntent } = data.priceIntentDataUpdate
      const { shopSession: updatedShopSession } = data.shopSessionCustomerUpdate
      if (updatedShopSession && priceIntent) {
        params.onSuccess({ priceIntent, customer: updatedShopSession.customer })
      }
    },
    onError(error) {
      datadogLogs.logger.error("Couldn't update price intent", {
        error,
        shopSessionId: params.shopSession.id,
        priceIntentId: priceIntent?.id,
      })
      showError(new Error(t('GENERAL_ERROR_DIALOG_PROMPT')))
    },
  })

  const handleSubmit = async (data: JSONData) => {
    const [customerData, priceIntentData] = separateCustomerData(data)
    if (customerData) {
      datadogLogs.logger.warn("Submitting customer data out of section isn't supported", {
        shopSessionId: params.shopSession.id,
        priceIntentId: priceIntent?.id,
      })
    }
    return await updateData({
      variables: {
        priceIntentId: priceIntent!.id,
        data: priceIntentData,
        customer: { shopSessionId: params.shopSession.id },
      },
    })
  }

  // NOTE: We probably want to refactor this in the future and stop editing priceIntent and customer data as a mix
  // We should either refactor this
  // - when we support Denmark / Norway
  // - when current solution becomes a problem
  const handleSubmitSection = (data: JSONData) => {
    if (!priceIntent) throw new Error('Not enough data to submit price calculator')
    const [customerData, priceIntentData] = separateCustomerData(data)

    if (priceIntentData) {
      updateData({
        variables: {
          priceIntentId: priceIntent.id,
          data: priceIntentData,
          customer: { shopSessionId: params.shopSession.id, ...customerData },
        },
      })
    }
  }

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
