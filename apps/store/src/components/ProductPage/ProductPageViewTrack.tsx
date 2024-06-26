'use client'
import { useEffect } from 'react'
import { useProductData } from '@/components/ProductData/ProductDataProvider'
import { useShopSessionId } from '@/services/shopSession/ShopSessionContext'
import { useTracking } from '@/services/Tracking/useTracking'

// Optimization - since tracking depends on shopSession,
// we don't want to run effects in components with children to avoid rerenders
export const ProductPageViewTracker = () => {
  // TODO: Provide some tracking API to use with router.ready to check if current page
  //  is the first during window lifetime -> then replace effect with event subscriptions
  const { id, displayNameFull } = useProductData()
  const shopSessionId = useShopSessionId()
  const tracking = useTracking()
  useEffect(() => {
    if (shopSessionId != null) {
      tracking.reportViewProductPage({ id, displayNameFull })
    }
  }, [tracking, id, displayNameFull, shopSessionId])
  return null
}
