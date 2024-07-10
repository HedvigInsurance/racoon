'use client'

import { useStore } from 'jotai'
import { startTransition, useCallback, useEffect, useRef, useState } from 'react'
import { yStack } from 'ui'
import { PriceLoader } from '@/components/PriceLoader'
import {
  priceIntentAtom,
  useIsPriceIntentStateReady,
  useSyncPriceIntentState,
} from '@/components/ProductPage/PurchaseForm/priceIntentAtoms'
import { Skeleton } from '@/components/Skeleton/Skeleton'
import { OfferPresenterNew } from '@/features/priceCalculator/OfferPresenterNew'
import { useConfirmPriceIntent } from '@/features/priceCalculator/useConfirmPriceIntent'
import { InsuranceDataForm } from './InsuranceDataForm'

type PurchaseFormStep = 'loadingForm' | 'fillForm' | 'calculatingPrice' | 'viewOffers'

// TODO:
// - handle SSN change warning (put in atoms?)
// - support preloaded priceIntentId
// - handle errors
// - proceed to cart
export function PurchaseFormNew() {
  useSyncPriceIntentState(undefined)
  const store = useStore()
  const isReady = useIsPriceIntentStateReady()
  const [step, setStep] = useState<PurchaseFormStep>('loadingForm')
  useEffect(() => {
    setStep(() => {
      if (!isReady) {
        return 'loadingForm'
      }
      const priceIntent = store.get(priceIntentAtom)
      if (priceIntent?.offers.length) {
        return 'viewOffers'
      }
      return 'fillForm'
    })
  }, [isReady, store])

  const confirmPriceIntent = useConfirmPriceIntent({
    onSuccess() {
      setStep('viewOffers')
    },
    onError(message) {
      console.log('TODO: show error', message)
      window.alert('Something went wrong. TODO: show error')
    },
  })
  const confirm = useCallback(() => {
    setStep('calculatingPrice')
    confirmPriceIntent()
  }, [confirmPriceIntent])

  const handleEdit = () => {
    startTransition(() => setStep('fillForm'))
  }

  switch (step) {
    case 'loadingForm':
      return <Skeleton style={{ height: '75vh' }} />
    case 'fillForm':
      return <InsuranceDataForm onSubmitSuccessAndReadyToConfirm={confirm} />
    case 'calculatingPrice':
      return (
        <div className={yStack({ justifyContent: 'center' })} style={{ minHeight: '75vh' }}>
          <PriceLoader />
        </div>
      )
    case 'viewOffers':
      return <PriceIntentOffers onEdit={handleEdit} />
    default:
      throw new Error(`Unexpected step: ${step}`)
  }
}

type PriceIntentOffersProps = {
  onEdit: () => void
}
function PriceIntentOffers({ onEdit }: PriceIntentOffersProps) {
  const wrapperRef = useRef(null)
  const notifyProductAdded = () => {
    window.alert('Added to cart. TODO: Implement further')
  }
  return (
    <div ref={wrapperRef}>
      <OfferPresenterNew
        scrollPastRef={wrapperRef}
        onClickEdit={onEdit}
        notifyProductAdded={notifyProductAdded}
      />
    </div>
  )
}
