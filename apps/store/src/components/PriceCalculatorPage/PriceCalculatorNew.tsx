'use client'
import { useShopSessionIdPromise } from '@/services/shopSession/ShopSessionContext'

export function PriceCalculatorNew() {
  const shopSessionId = useShopSessionIdPromise()
  return (
    <div>
      TODO
      <br /> shopSessionId={shopSessionId}
    </div>
  )
}
