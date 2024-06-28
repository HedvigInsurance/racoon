import { datadogLogs } from '@datadog/browser-logs'
import { useAtomValue, useSetAtom } from 'jotai'
import { useTranslation } from 'next-i18next'
import { startTransition, useCallback, useEffect } from 'react'
import {
  currentPriceIntentIdAtom,
  priceCalculatorLoadingAtom,
} from '@/components/PriceCalculator/priceCalculatorAtoms'
import { useAppErrorHandleContext } from '@/services/appErrors/AppErrorContext'
import { usePriceIntentDataUpdateMutation } from '@/services/graphql/generated'
import type { JSONData } from '@/services/PriceCalculator/PriceCalculator.types'
import type { PriceIntent } from '@/services/priceIntent/priceIntent.types'
import type { ShopSession } from '@/services/shopSession/ShopSession.types'
import { useShopSessionId } from '@/services/shopSession/ShopSessionContext'

type Params = {
  onSuccess: (values: { priceIntent: PriceIntent; customer: ShopSession['customer'] }) => void
}

export const useHandleSubmitPriceCalculator = (params: Params) => {
  const shopSessionId = useShopSessionId()!
  const priceIntentId = useAtomValue(currentPriceIntentIdAtom)!
  const updatePriceIntent = useUpdatePriceIntent({ onSuccess: params.onSuccess })

  const handleSubmit = useCallback(
    async (data: JSONData) => {
      const [customerData, priceIntentData] = separateCustomerData(data)
      if (customerData) {
        datadogLogs.logger.warn("Submitting customer data out of section isn't supported", {
          shopSessionId,
          priceIntentId,
        })
      }
      return await updatePriceIntent({
        variables: {
          priceIntentId,
          data: priceIntentData,
          customer: { shopSessionId },
        },
      })
    },
    [priceIntentId, shopSessionId, updatePriceIntent],
  )

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

  return [handleSubmit, handleSubmitSection] as const
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

type UseUpdatePriceIntentOptions = {
  onSuccess: (values: { priceIntent: PriceIntent; customer: ShopSession['customer'] }) => void
}

const useUpdatePriceIntent = ({ onSuccess }: UseUpdatePriceIntentOptions) => {
  const { t } = useTranslation('purchase-form')
  const { showError } = useAppErrorHandleContext()

  const [updatePriceIntent, { loading }] = usePriceIntentDataUpdateMutation({
    // priceIntent.suggestedData may be updated based on customer.ssn
    refetchQueries: 'active',
    awaitRefetchQueries: true,
    onCompleted: (data) => {
      const { priceIntent } = data.priceIntentDataUpdate
      const { shopSession: updatedShopSession } = data.shopSessionCustomerUpdate
      if (updatedShopSession && priceIntent) {
        onSuccess({ priceIntent, customer: updatedShopSession.customer })
      }
    },
    onError(error) {
      window.console.log("Couldn't update price intent", error)
      datadogLogs.logger.error("Couldn't update price intent", {
        error,
      })
      showError(new Error(t('GENERAL_ERROR_DIALOG_PROMPT')))
    },
  })

  const setIsPriceCalculatorLoading = useSetAtom(priceCalculatorLoadingAtom)
  useEffect(() => {
    setIsPriceCalculatorLoading(loading)
  }, [loading, setIsPriceCalculatorLoading])

  return updatePriceIntent
}
