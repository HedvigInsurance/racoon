'use client'
import { useProductData } from '@/components/ProductData/ProductDataProvider'
import { usePriceIntent } from '@/components/ProductPage/PriceIntentContext'
import { useShopSessionId } from '@/services/shopSession/ShopSessionContext'
import { TrackingProvider } from '@/services/Tracking/TrackingContext'

export const PriceIntentTrackingProvider = (props: { children: React.ReactNode }) => {
  const shopSessionId = useShopSessionId()
  const [priceIntent] = usePriceIntent()
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
