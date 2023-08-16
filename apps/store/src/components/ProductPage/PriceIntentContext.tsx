import { useApolloClient } from '@apollo/client'
import { useRouter } from 'next/router'
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useProductPageContext } from '@/components/ProductPage/ProductPageContext'
import {
  PriceIntentFragmentFragment,
  PriceIntentQueryResult,
  ProductOfferFragment,
  usePriceIntentQuery,
} from '@/services/apollo/generated'
import { priceIntentServiceInitClientSide } from '@/services/priceIntent/PriceIntentService'
import { ShopSession } from '@/services/shopSession/ShopSession.types'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { useCartEntryToReplace } from './ProductPage'
import { getOffersByPrice } from './PurchaseForm/getOffersByPrice'
import { usePreloadedPriceIntentId } from './PurchaseForm/usePreloadedPriceIntentId'
import { useSelectedOffer } from './PurchaseForm/useSelectedOffer'

type SetupPriceIntent = (shopSession: ShopSession) => Promise<void>
type ContextValue =
  | readonly [PriceIntentFragmentFragment | undefined, PriceIntentQueryResult, SetupPriceIntent]
  | null

export const PriceIntentContext = createContext<ContextValue>(null)

type Props = PropsWithChildren<unknown>

export const PriceIntentContextProvider = ({ children }: Props) => {
  const contextValue = usePriceIntentContextValue()
  return <PriceIntentContext.Provider value={contextValue}>{children}</PriceIntentContext.Provider>
}

const usePriceIntentContextValue = () => {
  const { priceTemplate, productData } = useProductPageContext()
  const apolloClient = useApolloClient()
  const { onReady, shopSession } = useShopSession()

  const [, setSelectedOffer] = useSelectedOffer()
  const entryToReplace = useCartEntryToReplace()
  const preloadedPriceIntentId = usePreloadedPriceIntentId()
  const [priceIntentId, setPriceIntentId] = useState<string | null>(preloadedPriceIntentId ?? null)

  const updatePriceIntent = useCallback(
    async (shopSession: ShopSession) => {
      const service = priceIntentServiceInitClientSide(apolloClient)
      const priceIntent = await service.getOrCreate({
        priceTemplate,
        productName: productData.name,
        shopSessionId: shopSession.id,
      })
      setPriceIntentId(priceIntent.id)
    },
    [apolloClient, priceTemplate, productData.name],
  )

  const result = usePriceIntentQuery({
    skip: !priceIntentId,
    variables: priceIntentId ? { priceIntentId } : undefined,
  })
  const priceIntent = result.data?.priceIntent

  const createNewPriceIntent = useCallback(
    async (shopSession: ShopSession) => {
      priceIntentServiceInitClientSide(apolloClient).clear(priceTemplate.name, shopSession.id)
      await updatePriceIntent(shopSession)
      setSelectedOffer(null)
    },
    [apolloClient, priceTemplate.name, updatePriceIntent, setSelectedOffer],
  )

  const router = useRouter()
  useEffect(() => {
    const handleRouteChangeComplete = () => {
      if (!shopSession) return
      updatePriceIntent(shopSession)
    }

    router.events.on('routeChangeComplete', handleRouteChangeComplete)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChangeComplete)
    }
  }, [router, shopSession, updatePriceIntent, priceIntentId])

  useEffect(
    () =>
      onReady((shopSession) => {
        if (priceIntentId) return
        updatePriceIntent(shopSession)
      }),
    [onReady, priceIntentId, updatePriceIntent],
  )

  // Configure a 'selectedOffer' based on the 'priceIntent'
  useEffect(() => {
    setSelectedOffer((prev) => {
      if (!priceIntent) return prev

      if (prev) {
        const matchingOffer = priceIntent.offers.find((item) => compareOffer(item, prev))
        if (matchingOffer) return matchingOffer
      }

      if (entryToReplace) {
        const matchingReplaceOffer = priceIntent.offers.find((item) =>
          compareOffer(item, entryToReplace),
        )
        if (matchingReplaceOffer) return matchingReplaceOffer
      }

      const priceMatchedOffer = priceIntent.offers.find((item) => item.priceMatch)
      if (priceMatchedOffer) return priceMatchedOffer

      return getOffersByPrice(priceIntent.offers)[0]
    })
  }, [priceIntent, entryToReplace, setSelectedOffer])

  // Make sure 'priceIntent' is synched to current product
  useEffect(() => {
    if (!shopSession || !priceIntent) {
      return
    }

    if (priceIntent.product.name !== productData.name) {
      setPriceIntentId(null)
      updatePriceIntent(shopSession)
    }
  }, [shopSession, priceIntent, priceIntent?.product.name, productData.name, updatePriceIntent])

  return [priceIntent, result, createNewPriceIntent] as const
}

export const usePriceIntent = () => {
  const contextValue = useContext(PriceIntentContext)
  if (!contextValue) {
    throw new Error('usePriceIntent called outside PriceIntentContext, no value to provide')
  }
  return contextValue
}

type ComparableProductOffer = Pick<ProductOfferFragment, 'deductible'> & {
  variant: Pick<ProductOfferFragment['variant'], 'typeOfContract'>
}

const compareOffer = (a: ComparableProductOffer, b: ComparableProductOffer) => {
  if (a.variant.typeOfContract !== b.variant.typeOfContract) return false
  if (JSON.stringify(a.deductible) !== JSON.stringify(b.deductible)) return false
  return true
}
