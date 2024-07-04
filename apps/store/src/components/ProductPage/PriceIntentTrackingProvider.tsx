'use client'
import { useStore } from 'jotai'
import { type ReactNode, useRef } from 'react'
import { useProductData } from '@/components/ProductData/ProductDataProvider'
import {
  currentPriceIntentIdAtom,
  priceIntentAtom,
} from '@/components/ProductPage/PurchaseForm/priceIntentAtoms'
import { type PriceIntentFragment } from '@/services/graphql/generated'
import { useShopSessionId } from '@/services/shopSession/ShopSessionContext'
import { TrackingProvider } from '@/services/Tracking/TrackingContext'

export const PriceIntentTrackingProvider = (props: { children: ReactNode }) => {
  const shopSessionId = useShopSessionId()
  const priceIntentRef = useRef<PriceIntentFragment | null>(null)
  const store = useStore()
  const priceIntentId = store.get(currentPriceIntentIdAtom)
  if (priceIntentId !== null) {
    // NOTE: `useAtomValue` won't work here since we need to read conditionally
    // Tying to read before `currentPriceIntentIdAtom` is set will lead to an error
    priceIntentRef.current = store.get(priceIntentAtom)
  }
  const productData = useProductData()

  return (
    <TrackingProvider
      shopSessionId={shopSessionId}
      priceIntent={priceIntentRef.current}
      productData={productData}
    >
      {props.children}
    </TrackingProvider>
  )
}
