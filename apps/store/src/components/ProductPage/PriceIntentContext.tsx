'use client'
import { useApolloClient } from '@apollo/client'
import { datadogLogs } from '@datadog/browser-logs'
import type { PropsWithChildren } from 'react'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { useProductData } from '@/components/ProductData/ProductDataProvider'
import { useProductPageContext } from '@/components/ProductPage/ProductPageContext'
import { useCartEntryToReplace } from '@/components/ProductPage/useCartEntryToReplace'
import type {
  PriceIntentFragment,
  PriceIntentQueryResult,
  ProductOfferFragment,
} from '@/services/graphql/generated'
import { usePriceIntentQuery } from '@/services/graphql/generated'
import { priceIntentServiceInitClientSide } from '@/services/priceIntent/PriceIntentService'
import type { ShopSession } from '@/services/shopSession/ShopSession.types'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { getOffersByPrice } from '@/utils/getOffersByPrice'
import { usePreloadedPriceIntentId } from './PurchaseForm/usePreloadedPriceIntentId'
import { useSelectedOffer } from './PurchaseForm/useSelectedOffer'

type ResetPriceIntent = () => void
type ContextValue =
  | readonly [PriceIntentFragment | undefined, PriceIntentQueryResult, ResetPriceIntent]
  | null

export const PriceIntentContext = createContext<ContextValue>(null)

type Props = PropsWithChildren<unknown>

export const PriceIntentContextProvider = ({ children }: Props) => {
  const contextValue = usePriceIntentContextValue()
  return <PriceIntentContext.Provider value={contextValue}>{children}</PriceIntentContext.Provider>
}

const usePriceIntentContextValue = () => {
  const { priceTemplate } = useProductPageContext()
  const productData = useProductData()
  const apolloClient = useApolloClient()
  const { onReady, shopSession } = useShopSession()

  const [, setSelectedOffer] = useSelectedOffer()
  const entryToReplace = useCartEntryToReplace()
  const preloadedPriceIntentId = usePreloadedPriceIntentId()
  const [priceIntentId, setPriceIntentId] = useState<string | null>(preloadedPriceIntentId ?? null)

  const updatePriceIntent = useCallback(
    async (shopSession: ShopSession) => {
      const service = priceIntentServiceInitClientSide(apolloClient)
      // TODO: We have potential data source conflict here - priceTemplate updates immediately on client-side navigation,
      // productData is somewhat delayed due to useEffect logic in ProductDataProvider
      // This is currently solved by eventually stabilizing, but ideally we should not be relying
      // on delayed effects to bring those 2 in sync
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
    onCompleted(data) {
      if (!shopSession) {
        datadogLogs.logger.warn('ShopSession not ready when price intent query completed', {
          priceIntentId,
        })
        return
      }

      if (data.priceIntent.product.name !== productData.name) {
        setPriceIntentId(null)
        updatePriceIntent(shopSession)
        return
      }
    },
  })
  const priceIntent = result.data?.priceIntent

  const shopSessionId = shopSession?.id
  const resetPriceIntent = useCallback(() => {
    if (shopSessionId == null) return
    priceIntentServiceInitClientSide(apolloClient).clear(priceTemplate.name, shopSessionId)
    setPriceIntentId(null)
    setSelectedOffer(null)
  }, [apolloClient, priceTemplate.name, setSelectedOffer, shopSessionId])

  // Sync with current product page (if any)
  useEffect(() => {
    if (!shopSession) return
    updatePriceIntent(shopSession)
  }, [shopSession, updatePriceIntent, priceIntentId])

  // Fallback for initial opening of product page where we're getting shopSession as the last piece of data
  // Everything else is created server-side and statically, shopSession dynamically client-side in this scenario
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

  return [priceIntent, result, resetPriceIntent] as const
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
