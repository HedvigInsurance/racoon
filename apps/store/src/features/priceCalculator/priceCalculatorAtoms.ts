// State atoms exclusive for new Price Calculator. Reusable atoms are located in priceIntentAtoms

import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'
import { currentPriceIntentIdAtom } from '@/components/ProductPage/PurchaseForm/priceIntentAtoms'
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
  (get, set, value: PriceCalculatorStep) => {
    const priceIntentId = getAtomValueOrThrow(get, currentPriceIntentIdAtom)
    set(priceCalculatorStepAtomFamily(priceIntentId), value)
  },
)
