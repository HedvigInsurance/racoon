// State atoms exclusive for new Price Calculator. Reusable atoms are located in priceIntentAtoms

import { type SbBlokData } from '@storyblok/react'
import { atom, useAtomValue } from 'jotai'
import { atomFamily } from 'jotai/utils'
import {
  currentPriceIntentIdAtom,
  priceIntentAtom,
} from '@/components/ProductPage/PurchaseForm/priceIntentAtoms'
import { type ProductOfferFragment } from '@/services/graphql/generated'
import { getAtomValueOrThrow } from '@/utils/jotaiUtils'

type PriceCalculatorStep = 'loadingForm' | 'fillForm' | 'calculatingPrice' | 'viewOffers'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const priceCalculatorStepAtomFamily = atomFamily((priceIntentId: string) =>
  atom<PriceCalculatorStep>('loadingForm'),
)

export const priceCalculatorStepAtom = atom(
  (get) => {
    const priceIntentId = get(currentPriceIntentIdAtom)
    if (priceIntentId == null) {
      return 'loadingForm'
    }
    return get(priceCalculatorStepAtomFamily(priceIntentId))
  },
  (get, set, value: PriceCalculatorStep | typeof INITIAL_STEP_AFTER_NAVIGATION) => {
    const priceIntentId = getAtomValueOrThrow(get, currentPriceIntentIdAtom)
    const atom = priceCalculatorStepAtomFamily(priceIntentId)
    if (value === INITIAL_STEP_AFTER_NAVIGATION) {
      const priceIntent = get(priceIntentAtom)
      if (priceIntent?.offers.length) {
        set(atom, 'viewOffers')
      } else {
        set(atom, 'fillForm')
      }
    } else {
      set(atom, value)
    }
  },
)
export const INITIAL_STEP_AFTER_NAVIGATION = Symbol('INITIAL_STEP_AFTER_NAVIGATION')

export const priceCalculatorDeductibleInfoAtom = atom<Array<SbBlokData> | null>(null)

export const usePriceCalculatorDeductibleInfo = () => {
  const value = useAtomValue(priceCalculatorDeductibleInfoAtom)
  if (value == null) {
    throw new Error('Expected to have price calculator deductible info')
  }
  return value
}

export const priceCalculatorShowEditSsnWarningAtom = atom(false)

export const priceCalculatorAddedOffer = atom<ProductOfferFragment | null>(null)
