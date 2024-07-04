'use client'
import { useAtomValue } from 'jotai'
import { type ReactNode } from 'react'
import { useProductData } from '@/components/ProductData/ProductDataProvider'
import { priceIntentAtom } from '@/components/ProductPage/PurchaseForm/priceIntentAtoms'
import { useShopSessionId } from '@/services/shopSession/ShopSessionContext'
import { TrackingProvider } from '@/services/Tracking/TrackingContext'

export const PriceIntentTrackingProvider = (props: { children: ReactNode }) => {
  const shopSessionId = useShopSessionId()
  // NOTE: Can be null unlike `usePriceIntent()` which will crash if not loaded yet
  const priceIntent = useAtomValue(priceIntentAtom)
  const productData = useProductData()

  return (
    <TrackingProvider
      shopSessionId={shopSessionId}
      priceIntent={priceIntent}
      productData={productData}
    >
      {props.children}
    </TrackingProvider>
  )
}
