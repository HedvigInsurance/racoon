import { useApolloClient } from '@apollo/client'
import { datadogLogs } from '@datadog/browser-logs'
import { type Atom, atom, type Getter, useAtomValue, useSetAtom, useStore } from 'jotai'
import { atomFamily } from 'jotai/utils'
import { useCallback, useEffect, useState } from 'react'
import { useProductData } from '@/components/ProductData/ProductDataProvider'
import {
  priceTemplateAtom,
  usePriceTemplate,
} from '@/components/ProductPage/PurchaseForm/priceTemplateAtom'
import { useSelectedOffer } from '@/components/ProductPage/PurchaseForm/useSelectedOffer'
import { useCartEntryToReplace } from '@/components/ProductPage/useCartEntryToReplace'
import {
  type PriceIntentFragment,
  type ProductOfferFragment,
  type ShopSessionCustomerFragment,
  usePriceIntentQuery,
} from '@/services/graphql/generated'
import { setupForm } from '@/services/PriceCalculator/PriceCalculator.helpers'
import { type Form } from '@/services/PriceCalculator/PriceCalculator.types'
import { priceIntentServiceInitClientSide } from '@/services/priceIntent/PriceIntentService'
import { useShopSession, useShopSessionId } from '@/services/shopSession/ShopSessionContext'
import { getOffersByPrice } from '@/utils/getOffersByPrice'

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

export const useSyncPriceIntentState = (preloadedPriceIntentId?: string): void => {
  const priceTemplate = useAtomValue(priceTemplateAtom)
  const productName = useProductData().name
  const entryToReplace = useCartEntryToReplace()
  const { shopSession } = useShopSession()
  const shopSessionId = shopSession?.id
  const apolloClient = useApolloClient()

  const initialPriceIntentId = preloadedPriceIntentId || entryToReplace?.priceIntentId
  const cart = shopSession?.cart
  const [priceIntentId, setPriceIntentId] = useState<string | null>(null)
  useEffect(() => {
    if (shopSessionId == null || priceTemplate == null) {
      return
    }
    if (initialPriceIntentId != null) {
      setPriceIntentId(initialPriceIntentId)
      return
    }

    const service = priceIntentServiceInitClientSide(apolloClient)
    const createPriceIntent = () => {
      service.create({ productName, priceTemplate, shopSessionId }).then((priceIntent) => {
        setPriceIntentId(priceIntent.id)
      })
    }

    const savedId = service.getStoredId(priceTemplate.name, shopSessionId)
    if (savedId == null) {
      createPriceIntent()
    } else {
      const cartPriceIntentIds = new Set(cart?.entries.map((item) => item.priceIntentId))
      if (cartPriceIntentIds.has(savedId)) {
        console.log('Current priceIntent used in one of cart items, creating new one')
        createPriceIntent()
      } else {
        setPriceIntentId(savedId)
      }
    }
  }, [apolloClient, cart?.entries, initialPriceIntentId, priceTemplate, productName, shopSessionId])

  const queryResult = usePriceIntentQuery({
    skip: priceIntentId == null,
    variables: priceIntentId ? { priceIntentId } : undefined,
  })

  const store = useStore()
  const syncSelectedOffer = useSyncSelectedOffer()
  useEffect(() => {
    const { priceIntent } = queryResult.data ?? {}
    if (priceIntent != null && priceIntent.id === priceIntentId) {
      if (priceIntent.product.name !== productName) {
        console.warn(
          `Loaded priceIntent has different product. Expected=${productName}, actual=${priceIntent.product.name})`,
        )
      }
      store.set(currentPriceIntentIdAtom, priceIntentId)
      store.set(priceIntentAtomFamily(priceIntentId), priceIntent)
      syncSelectedOffer(priceIntent)
    }
  }, [entryToReplace, priceIntentId, productName, queryResult.data, syncSelectedOffer, store])

  const setIsLoading = useSetAtom(priceCalculatorLoadingAtom)
  useEffect(() => {
    setIsLoading(queryResult.loading || priceIntentId == null)
  }, [priceIntentId, queryResult.loading, setIsLoading])

  useEffect(() => {
    store.set(shopSessionCustomerAtom, shopSession?.customer ?? null)
  }, [shopSession?.customer, store])
}

const useSyncSelectedOffer = () => {
  const [, setSelectedOffer] = useSelectedOffer()
  const entryToReplace = useCartEntryToReplace()
  return useCallback(
    (priceIntent: PriceIntentFragment) => {
      setSelectedOffer((prev) => {
        if (prev != null) {
          const matchingOffer = priceIntent.offers.find((item) => compareOffer(item, prev))
          if (matchingOffer) return matchingOffer
        }

        if (entryToReplace != null) {
          const matchingReplaceOffer = priceIntent.offers.find((item) =>
            compareOffer(item, entryToReplace),
          )
          if (matchingReplaceOffer) return matchingReplaceOffer
        }

        const priceMatchedOffer = priceIntent.offers.find((item) => item.priceMatch != null)
        if (priceMatchedOffer) return priceMatchedOffer

        return getOffersByPrice(priceIntent.offers)[0]
      })
    },
    [entryToReplace, setSelectedOffer],
  )
}

type ComparableProductOffer = Pick<ProductOfferFragment, 'deductible'> & {
  variant: Pick<ProductOfferFragment['variant'], 'typeOfContract'>
}

const compareOffer = (a: ComparableProductOffer, b: ComparableProductOffer) => {
  if (a.variant.typeOfContract !== b.variant.typeOfContract) return false
  if (JSON.stringify(a.deductible) !== JSON.stringify(b.deductible)) return false
  return true
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

export const useResetPriceIntent = () => {
  const shopSessionId = useShopSessionId()
  const apolloClient = useApolloClient()
  const templateName = usePriceTemplate().name
  const [, setSelectedOffer] = useSelectedOffer()
  const setCurrentPriceIntentId = useSetAtom(currentPriceIntentIdAtom)

  return useCallback(() => {
    if (shopSessionId == null) return
    const service = priceIntentServiceInitClientSide(apolloClient)
    service.clear(shopSessionId, templateName)
    setCurrentPriceIntentId(null)
    setSelectedOffer(null)
  }, [apolloClient, setCurrentPriceIntentId, setSelectedOffer, shopSessionId, templateName])
}