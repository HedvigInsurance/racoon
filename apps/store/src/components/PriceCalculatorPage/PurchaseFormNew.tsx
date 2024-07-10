'use client'

import { datadogLogs } from '@datadog/browser-logs'
import { datadogRum } from '@datadog/browser-rum'
import { useStore } from 'jotai'
import { useTranslation } from 'next-i18next'
import { startTransition, useCallback, useEffect, useRef, useState } from 'react'
import { PriceCalculator } from '@/components/PriceCalculator/PriceCalculator'
import { PriceLoader } from '@/components/PriceLoader'
import { OfferPresenter } from '@/components/ProductPage/PurchaseForm/OfferPresenter'
import {
  priceIntentAtom,
  useIsPriceIntentStateReady,
  usePriceIntentId,
  useSyncPriceIntentState,
} from '@/components/ProductPage/PurchaseForm/priceIntentAtoms'
import { useSelectedOffer } from '@/components/ProductPage/PurchaseForm/useSelectedOffer'
import { Skeleton } from '@/components/Skeleton/Skeleton'
import { BankSigneringEvent } from '@/services/bankSignering'
import {
  ExternalInsuranceCancellationOption,
  usePriceIntentConfirmMutation,
} from '@/services/graphql/generated'

type PurchaseFormStep = 'loading' | 'fillForm' | 'viewOffers'

// TODO:
// - support preloaded priceIntentId
// - show preview of completed sections with "edit" links
// - handle errors
export function PurchaseFormNew() {
  useSyncPriceIntentState(undefined)
  const store = useStore()
  const isReady = useIsPriceIntentStateReady()
  const [step, setStep] = useState<PurchaseFormStep>('loading')
  useEffect(() => {
    setStep(() => {
      if (!isReady) {
        return 'loading'
      }
      const priceIntent = store.get(priceIntentAtom)
      if (priceIntent?.offers.length) {
        return 'viewOffers'
      }
      return 'fillForm'
    })
  }, [isReady, store])

  const handleConfirmSuccess = () => {
    setStep('viewOffers')
  }
  const handleEdit = () => {
    startTransition(() => setStep('fillForm'))
  }
  if (step === 'loading') {
    return <Skeleton style={{ height: '75vh' }} />
  } else if (step === 'fillForm') {
    return <PriceCalculatorForm onConfirmSuccess={handleConfirmSuccess} />
  } else {
    return <PriceIntentOffers onEdit={handleEdit} />
  }
}

type PriceCalculatorFormProps = {
  onConfirmSuccess: () => void
}

function PriceCalculatorForm({ onConfirmSuccess }: PriceCalculatorFormProps) {
  const [confirmPriceIntent, isLoadingPrice] = useHandleConfirmPriceIntent({
    onSuccess() {
      onConfirmSuccess()
    },
    onError(message) {
      console.log('Failed to confirm price intent, message:', message)
      // TODO: show error
    },
  })
  if (isLoadingPrice) {
    return <PriceLoader />
  }
  return <PriceCalculator onConfirm={confirmPriceIntent}></PriceCalculator>
}

type ConfirmPriceIntentOptions = {
  onSuccess: () => void
  onError: (message: string) => void
}
const useHandleConfirmPriceIntent = ({ onSuccess, onError }: ConfirmPriceIntentOptions) => {
  const priceIntentId = usePriceIntentId()
  const { t } = useTranslation('purchase-form')
  const [isLoadingPrice, setIsLoadingPrice] = useState(false)
  const [startMutation] = usePriceIntentConfirmMutation({
    variables: { priceIntentId },

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
      setIsLoadingPrice(false)
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

  const confirmPriceIntent = useCallback(
    (...args: Parameters<typeof startMutation>) => {
      setIsLoadingPrice(true)
      startMutation(...args)
    },
    [startMutation],
  )

  return [confirmPriceIntent, isLoadingPrice] as const
}

type PriceIntentOffersProps = {
  onEdit: () => void
}
function PriceIntentOffers({ onEdit }: PriceIntentOffersProps) {
  const [selectedOffer] = useSelectedOffer()
  console.log('selectedOffer', selectedOffer)
  const wrapperRef = useRef(null)
  const notifyProductAdded = () => {
    console.log('product added to cart')
  }
  return (
    <div ref={wrapperRef}>
      <OfferPresenter
        scrollPastRef={wrapperRef}
        onClickEdit={onEdit}
        notifyProductAdded={notifyProductAdded}
      />
    </div>
  )
}
