import { datadogLogs } from '@datadog/browser-logs'
import { type Atom, atom, type Getter, useAtomValue, useStore } from 'jotai'
import { atomFamily } from 'jotai/utils'
import { useEffect } from 'react'
import { priceTemplateAtom } from '@/components/ProductPage/PurchaseForm/priceTemplateAtom'
import {
  type PriceIntentFragment,
  type ShopSessionCustomerFragment,
} from '@/services/graphql/generated'
import { setupForm } from '@/services/PriceCalculator/PriceCalculator.helpers'
import { type Form } from '@/services/PriceCalculator/PriceCalculator.types'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'

export const currentPriceIntentIdAtom = atom<string | null>(null)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const priceIntentAtomFamily = atomFamily((priceIntentId: unknown) =>
  atom<PriceIntentFragment | null>(null),
)

export const priceIntentAtom = atom<PriceIntentFragment>((get) => {
  const priceIntentId = getAtomValueOrThrow(get, currentPriceIntentIdAtom)
  return getAtomValueOrThrow(get, priceIntentAtomFamily(priceIntentId))
})

export const shopSessionCustomerAtom = atom<ShopSessionCustomerFragment | null>(null)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const priceCalculatorFormAtom = atom<Form>((get) => {
  const priceIntent = get(priceIntentAtom)
  const template = getAtomValueOrThrow(get, priceTemplateAtom)
  return setupForm({
    customer: get(shopSessionCustomerAtom),
    priceIntent,
    template,
  })
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const activeFormSectionIdAtomFamily = atomFamily((priceIntentId: unknown) =>
  atom<string | null>(null),
)

export const activeFormSectionIdAtom = atom(
  (get) => {
    const priceIntentId = getAtomValueOrThrow(get, currentPriceIntentIdAtom)
    const activeSectionId = get(activeFormSectionIdAtomFamily(priceIntentId))
    if (activeSectionId != null) {
      return activeSectionId
    }
    const form = get(priceCalculatorFormAtom)
    const firstIncompleteSection = form.sections.find(({ state }) => state !== 'valid')
    if (firstIncompleteSection) {
      return firstIncompleteSection.id
    }
    return form.sections[form.sections.length - 1].id
  },
  (get, set, newValue: string | typeof GOTO_NEXT_SECTION) => {
    const priceIntentId = getAtomValueOrThrow(get, currentPriceIntentIdAtom)
    if (newValue === GOTO_NEXT_SECTION) {
      const oldValue = get(activeFormSectionIdAtom)
      const form = get(priceCalculatorFormAtom)
      const currentSectionIndex = form.sections.findIndex(({ id }) => id === oldValue)

      // If section has both customer and priceIntent fields, we'll get two onSuccess callbacks
      // in unknown order. Making sure we only go forward when section fields are all filled
      if (form.sections[currentSectionIndex].state !== 'valid') {
        return
      }
      const nextSection = form.sections[currentSectionIndex + 1]
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (nextSection) {
        set(activeFormSectionIdAtomFamily(priceIntentId), nextSection.id)
        return
      } else {
        const templateName = get(priceTemplateAtom)?.name
        datadogLogs.logger.error('Failed to find next section', {
          oldValue,
          templateName,
          priceIntentId,
        })
      }
    } else {
      set(activeFormSectionIdAtomFamily(priceIntentId), newValue)
    }
  },
)
export const GOTO_NEXT_SECTION = Symbol('GOTO_NEXT_SECTION')

// TODO: Consider moving to utils
const getAtomValueOrThrow = <T>(get: Getter, atom: Atom<T>): NonNullable<T> => {
  const value = get(atom)
  if (value == null) {
    throw new Error(`${atom} must have value`)
  }
  return value
}

export const useSyncPriceIntentState = (priceIntent?: PriceIntentFragment): void => {
  const shopSessionCustomer = useShopSession().shopSession?.customer
  const store = useStore()
  useEffect(() => {
    if (priceIntent != null) {
      store.set(currentPriceIntentIdAtom, priceIntent.id)
      store.set(priceIntentAtomFamily(priceIntent.id), priceIntent)
    }
  }, [priceIntent, store])
  useEffect(() => {
    store.set(shopSessionCustomerAtom, shopSessionCustomer ?? null)
  }, [shopSessionCustomer, store])
}

export const useIsPriceIntentStateReady = (): boolean => {
  return !!useAtomValue(currentPriceIntentIdAtom)
}

export const priceCalculatorLoadingAtom = atom(false)

export const usePriceIntentId = (): string => {
  const priceIntentId = useAtomValue(currentPriceIntentIdAtom)
  if (priceIntentId == null) {
    throw new Error('priceIntentId must be defined')
  }
  return priceIntentId
}
