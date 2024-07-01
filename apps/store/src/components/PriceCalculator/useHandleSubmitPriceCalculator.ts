import { datadogLogs } from '@datadog/browser-logs'
import { useTranslation } from 'next-i18next'
import { startTransition, useCallback } from 'react'
import { useAppErrorHandleContext } from '@/services/appErrors/AppErrorContext'
import { usePriceIntentDataUpdateMutation } from '@/services/graphql/generated'
import type { JSONData } from '@/services/PriceCalculator/PriceCalculator.types'
import type { PriceIntent } from '@/services/priceIntent/priceIntent.types'
import type { ShopSession } from '@/services/shopSession/ShopSession.types'

type Params = {
  shopSession: ShopSession
  priceIntent: PriceIntent
  onSuccess: (values: { priceIntent: PriceIntent; customer: ShopSession['customer'] }) => void
}

export const useHandleSubmitPriceCalculator = (params: Params) => {
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
      window.console.log("Couldn't update price intent", error)
      datadogLogs.logger.error("Couldn't update price intent", {
        error,
        shopSessionId: params.shopSession.id,
        priceIntentId: params.priceIntent.id,
      })
      showError(new Error(t('GENERAL_ERROR_DIALOG_PROMPT')))
    },
  })

  const handleSubmit = useCallback(
    async (data: JSONData) => {
      const [customerData, priceIntentData] = separateCustomerData(data)
      if (customerData) {
        datadogLogs.logger.warn("Submitting customer data out of section isn't supported", {
          shopSessionId: params.shopSession.id,
          priceIntentId: params.priceIntent.id,
        })
      }
      return await updateData({
        variables: {
          priceIntentId: params.priceIntent.id,
          data: priceIntentData,
          customer: { shopSessionId: params.shopSession.id },
        },
      })
    },
    [params.priceIntent.id, params.shopSession.id, updateData],
  )

  // NOTE: We probably want to refactor this in the future and stop editing priceIntent and customer data as a mix
  // We should refactor this when current solution becomes a problem
  const handleSubmitSection = useCallback(
    (data: JSONData) => {
      const [customerData, priceIntentData] = separateCustomerData(data)

      if (priceIntentData) {
        startTransition(() => {
          updateData({
            variables: {
              priceIntentId: params.priceIntent.id,
              data: priceIntentData,
              customer: { shopSessionId: params.shopSession.id, ...customerData },
            },
          })
        })
      }
    },
    [params.priceIntent.id, params.shopSession.id, updateData],
  )

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
