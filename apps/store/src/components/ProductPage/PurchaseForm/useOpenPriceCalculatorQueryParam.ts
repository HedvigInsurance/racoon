import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'

export const OPEN_PRICE_CALCULATOR_QUERY_PARAM = 'openPriceCalculator'

type Options = {
  onQueryParamDetected: () => void
}
export const useOpenPriceCalculatorQueryParam = ({ onQueryParamDetected }: Options) => {
  const router = useRouter()
  const triggeredRef = useRef(false)
  useEffect(() => {
    const { [OPEN_PRICE_CALCULATOR_QUERY_PARAM]: openPriceCalculator } = router.query
    if (router.isReady && openPriceCalculator === '1' && !triggeredRef.current) {
      // Guards against repeated triggers in case any other query param changes
      // GOTCHA: We've tried removing query param via shallow router.replace, but it triggers some weird
      // window.location change, and this problem only ever happens in production
      triggeredRef.current = true
      onQueryParamDetected()
    }
  }, [onQueryParamDetected, router])
}
