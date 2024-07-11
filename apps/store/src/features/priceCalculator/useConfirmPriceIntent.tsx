import { datadogLogs } from '@datadog/browser-logs'
import { datadogRum } from '@datadog/browser-rum'
import { useAtomValue } from 'jotai'
import { useTranslation } from 'next-i18next'
import { currentPriceIntentIdAtom } from '@/components/ProductPage/PurchaseForm/priceIntentAtoms'
import { BankSigneringEvent } from '@/services/bankSignering'
import {
  ExternalInsuranceCancellationOption,
  usePriceIntentConfirmMutation,
} from '@/services/graphql/generated'

type ConfirmPriceIntentOptions = {
  onSuccess: () => void
  onError: (message: string) => void
}
export const useConfirmPriceIntent = ({ onSuccess, onError }: ConfirmPriceIntentOptions) => {
  const priceIntentId = useAtomValue(currentPriceIntentIdAtom)
  const { t } = useTranslation('purchase-form')
  const [confirmPriceIntent] = usePriceIntentConfirmMutation({
    variables: { priceIntentId: priceIntentId! },

    onError(error) {
      datadogLogs.logger.warn('Failed to confirm price intent', {
        error,
        priceIntentId,
      })
      if (error.networkError || error.graphQLErrors.length > 0) {
        // Unknown error
        onError(t('GENERAL_ERROR_DIALOG_PROMPT'))
      } else {
        // User error
        onError(error.message)
      }
    },
    onCompleted(data) {
      const updatedPriceIntent = data.priceIntentConfirm.priceIntent
      if (updatedPriceIntent) {
        const hasBankSigneringOffer = updatedPriceIntent.offers.some(
          (item) => item.cancellation.option === ExternalInsuranceCancellationOption.Banksignering,
        )
        if (hasBankSigneringOffer) {
          datadogRum.addAction(BankSigneringEvent.Offered)
        }
        onSuccess()
      } else {
        throw new Error(
          `UNEXPECTED: price intent not updated without user error (${priceIntentId})`,
        )
      }
    },
  })

  if (priceIntentId == null) {
    return () => {
      console.error('tried to confirm PriceIntent before state is ready')
    }
  }

  return confirmPriceIntent
}
