import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'

export const OPEN_PRICE_CALCULATOR_QUERY_PARAM = 'openPriceCalculator'

type Params = {
  onQueryParamDetected: () => void
}

export const useOpenPriceCalculatorQueryParam = ({ onQueryParamDetected }: Params) => {
  const router = useRouter()
  const triggeredRef = useRef(false)

  const isPriceCalculatorExpanded = useIsPriceCalculatorExpanded()

  useEffect(() => {
    if (router.isReady && isPriceCalculatorExpanded && !triggeredRef.current) {
      // Guards against repeated triggers in case any other query param changes
      // GOTCHA: We've tried removing query param via shallow router.replace, but it triggers some weird
      // window.location change, and this problem only ever happens in production
      triggeredRef.current = true
      onQueryParamDetected()
    }
  }, [onQueryParamDetected, router, isPriceCalculatorExpanded])
}

export const useIsPriceCalculatorExpanded = () => {
  const router = useRouter()
  const { [OPEN_PRICE_CALCULATOR_QUERY_PARAM]: openPriceCalculator } = router.query
  return openPriceCalculator === '1'
}
