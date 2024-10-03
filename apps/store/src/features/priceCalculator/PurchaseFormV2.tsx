'use client'

import { useAtom } from 'jotai'
import { useEffect } from 'react'
import { PriceLoader } from '@/components/PriceLoader'
import {
  useIsPriceIntentStateReady,
  useSyncPriceIntentState,
} from '@/components/ProductPage/PurchaseForm/priceIntentAtoms'
import {
  PRELOADED_PRICE_INTENT_QUERY_PARAM,
  usePreloadedPriceIntentId,
} from '@/components/ProductPage/PurchaseForm/usePreloadedPriceIntentId'
import { Skeleton } from '@/components/Skeleton/Skeleton'
import { OfferPresenterV2 } from '@/features/priceCalculator/OfferPresenterV2'
import {
  INITIAL_STEP_AFTER_NAVIGATION,
  priceCalculatorStepAtom,
} from '@/features/priceCalculator/priceCalculatorAtoms'
import { InsuranceDataForm } from './InsuranceDataForm'
import {
  centered,
  priceLoaderWrapper,
  viewOffersWrapper,
  purchaseSummaryWrapper,
} from './PurchaseFormV2.css'
import { PurchaseSummary } from './PurchaseSummary'

export function PurchaseFormV2() {
  useSyncPriceIntentState()
  useWarnOnPreloadedPriceIntentId()

  const isReady = useIsPriceIntentStateReady()
  const [step, setStep] = useAtom(priceCalculatorStepAtom)
  useEffect(() => {
    if (isReady) {
      setStep(INITIAL_STEP_AFTER_NAVIGATION)
    }
  }, [isReady, setStep])

  switch (step) {
    case 'loadingForm':
      return <Skeleton className={centered} style={{ height: '75vh' }} />
    case 'fillForm':
      return <InsuranceDataForm className={centered} />
    case 'calculatingPrice':
      return (
        <div className={priceLoaderWrapper}>
          <PriceLoader />
        </div>
      )
    case 'viewOffers':
      return (
        <div className={viewOffersWrapper}>
          <InsuranceDataForm />
          <OfferPresenterV2 />
        </div>
      )
    case 'purchaseSummary':
      return (
        <div className={purchaseSummaryWrapper}>
          <PurchaseSummary className={centered} />
        </div>
      )
    default:
      throw new Error(`Unexpected step: ${step}`)
  }
}

const useWarnOnPreloadedPriceIntentId = () => {
  const preloadedPriceIntentId = usePreloadedPriceIntentId()
  useEffect(() => {
    if (preloadedPriceIntentId != null) {
      console.warn(
        `preloadedPriceIntentId is not supported on PriceCalculatorPage, please find and update the code that sets ${PRELOADED_PRICE_INTENT_QUERY_PARAM} query param`,
      )
    }
  }, [preloadedPriceIntentId])
}
