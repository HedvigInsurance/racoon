import { useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { useShopSessionId } from '@/services/shopSession/ShopSessionContext'

export const OPEN_PRICE_CALCULATOR_QUERY_PARAM = 'openPriceCalculator'

type Params = {
  onQueryParamDetected: () => void
}

export const useOpenPriceCalculatorQueryParam = ({ onQueryParamDetected }: Params) => {
  const triggeredRef = useRef(false)
  const isPriceCalculatorExpanded = useIsPriceCalculatorExpanded()
  const shopSessionId = useShopSessionId()

  useEffect(() => {
    if (isPriceCalculatorExpanded && shopSessionId != null && !triggeredRef.current) {
      // Guards against repeated triggers in case any other query param changes
      // GOTCHA: We've tried removing query param via shallow router.replace, but it triggers some weird
      // window.location change, and this problem only ever happens in production
      triggeredRef.current = true
      onQueryParamDetected()
    }
  }, [onQueryParamDetected, isPriceCalculatorExpanded, shopSessionId])
}

export const useIsPriceCalculatorExpanded = () => {
  const searchParams = useSearchParams()
  return searchParams?.get(OPEN_PRICE_CALCULATOR_QUERY_PARAM) === '1'
}
