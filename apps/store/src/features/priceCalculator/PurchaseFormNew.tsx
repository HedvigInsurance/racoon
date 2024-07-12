'use client'

import { useAtom, useStore } from 'jotai'
import { useEffect } from 'react'
import { yStack } from 'ui'
import { PriceLoader } from '@/components/PriceLoader'
import {
  priceIntentAtom,
  useIsPriceIntentStateReady,
  useSyncPriceIntentState,
} from '@/components/ProductPage/PurchaseForm/priceIntentAtoms'
import { Skeleton } from '@/components/Skeleton/Skeleton'
import { OfferPresenterNew } from '@/features/priceCalculator/OfferPresenterNew'
import { priceCalculatorStepAtom } from '@/features/priceCalculator/priceCalculatorAtoms'
import { InsuranceDataForm } from './InsuranceDataForm'

// TODO:
// - handle SSN change warning (put in atoms?)
// - support preloaded priceIntentId
// - handle errors
// - proceed to cart
export function PurchaseFormNew() {
  useSyncPriceIntentState(undefined)
  const store = useStore()
  const isReady = useIsPriceIntentStateReady()
  const [step, setStep] = useAtom(priceCalculatorStepAtom)
  useEffect(() => {
    if (!isReady) return
    const priceIntent = store.get(priceIntentAtom)
    if (priceIntent?.offers.length) {
      setStep('viewOffers')
    } else {
      setStep('fillForm')
    }
  }, [isReady, setStep, store])

  switch (step) {
    case 'loadingForm':
      return <Skeleton style={{ height: '75vh' }} />
    case 'fillForm':
      return <InsuranceDataForm />
    case 'calculatingPrice':
      return (
        <div className={yStack({ justifyContent: 'center' })} style={{ minHeight: '75vh' }}>
          <PriceLoader />
        </div>
      )
    case 'viewOffers':
      return (
        <div className={yStack({})} style={{ gap: '2.75rem' }}>
          <InsuranceDataForm />
          <OfferPresenterNew />
        </div>
      )
    default:
      throw new Error(`Unexpected step: ${step}`)
  }
}
