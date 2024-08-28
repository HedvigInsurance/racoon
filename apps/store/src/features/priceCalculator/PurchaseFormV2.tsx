'use client'

import { useAtom } from 'jotai'
import { useEffect } from 'react'
import { yStack } from 'ui'
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
import { BonusOfferPresenter } from './BonusOfferPresenter'
import { InsuranceDataForm } from './InsuranceDataForm'

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
      return <Skeleton style={{ height: '75vh' }} />
    case 'fillForm':
      return <InsuranceDataForm />
    case 'calculatingPrice':
      return (
        <div
          className={yStack({ gap: 'md', justifyContent: 'center' })}
          style={{ minHeight: '75vh' }}
        >
          <PriceLoader />
        </div>
      )
    case 'viewOffers':
      return (
        <div className={yStack({ gap: 'md' })} style={{ gap: '2.75rem' }}>
          <InsuranceDataForm />
          <OfferPresenterV2 />
        </div>
      )
    case 'viewBonusOffer':
      return <BonusOfferPresenter />
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
