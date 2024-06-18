'use client'
import { useProductData } from '@/components/ProductData/ProductDataProvider'
import { usePriceIntent } from '@/components/ProductPage/PriceIntentContext'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { TrackingProvider } from '@/services/Tracking/TrackingContext'

export const PriceIntentTrackingProvider = (props: { children: React.ReactNode }) => {
  const { shopSession } = useShopSession()
  const [priceIntent] = usePriceIntent()
  const productData = useProductData()

  return (
    <TrackingProvider shopSession={shopSession} priceIntent={priceIntent} productData={productData}>
      {props.children}
    </TrackingProvider>
  )
}
