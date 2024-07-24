import { datadogLogs } from '@datadog/browser-logs'
import { datadogRum } from '@datadog/browser-rum'
import { useAtomValue, useSetAtom } from 'jotai'
import { startTransition } from 'react'
import { currentPriceIntentIdAtom } from '@/components/ProductPage/PurchaseForm/priceIntentAtoms'
import { priceCalculatorStepAtom } from '@/features/priceCalculator/priceCalculatorAtoms'
import { useAppErrorHandleContext } from '@/services/appErrors/AppErrorContext'
import { BankSigneringEvent } from '@/services/bankSignering'
import {
  ExternalInsuranceCancellationOption,
  usePriceIntentConfirmMutation,
} from '@/services/graphql/generated'

export const useConfirmPriceIntent = () => {
  const priceIntentId = useAtomValue(currentPriceIntentIdAtom)
  const { showError } = useAppErrorHandleContext()
  const setStep = useSetAtom(priceCalculatorStepAtom)
  const [confirmPriceIntent] = usePriceIntentConfirmMutation({
    variables: { priceIntentId: priceIntentId! },

    onError(error) {
      datadogLogs.logger.warn('Failed to confirm price intent', {
        error,
        priceIntentId,
      })
      showError(error)
      // Prevent form flicker until dialog opens
      startTransition(() => setStep('fillForm'))
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
        setStep('viewOffers')
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
