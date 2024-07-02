import { datadogLogs } from '@datadog/browser-logs'
import { useSetAtom } from 'jotai'
import { useTranslation } from 'next-i18next'
import { useEffect } from 'react'
import { priceCalculatorLoadingAtom } from '@/components/ProductPage/PurchaseForm/priceIntentAtoms'
import { useAppErrorHandleContext } from '@/services/appErrors/AppErrorContext'
import {
  type ShopSessionCustomerFragment,
  usePriceIntentDataUpdateMutation,
} from '@/services/graphql/generated'
import type { PriceIntent } from '@/services/priceIntent/priceIntent.types'

type Options = {
  onSuccess: (values: {
    priceIntent: PriceIntent
    customer: ShopSessionCustomerFragment | undefined
  }) => void
}

export const useUpdatePriceIntent = ({ onSuccess }: Options) => {
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
        onSuccess({ priceIntent, customer: updatedShopSession.customer ?? undefined })
      }
    },
    onError(error) {
      console.log("Couldn't update price intent", error)
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
