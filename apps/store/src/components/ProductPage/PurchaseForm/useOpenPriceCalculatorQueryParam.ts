import { useRouter } from 'next/router'
import { useEffect } from 'react'

export const OPEN_PRICE_CALCULATOR_QUERY_PARAM = 'openPriceCalculator'

type Options = {
  onQueryParamDetected: () => void
}
export const useOpenPriceCalculatorQueryParam = ({ onQueryParamDetected }: Options) => {
  const router = useRouter()
  const { [OPEN_PRICE_CALCULATOR_QUERY_PARAM]: openPriceCalculator } = router.query
  useEffect(() => {
    if (router.isReady && openPriceCalculator === '1') {
      const nextQuery = { ...router.query }
      delete nextQuery[OPEN_PRICE_CALCULATOR_QUERY_PARAM]
      router.replace({ pathname: router.pathname, query: nextQuery }, undefined, { shallow: true })
      onQueryParamDetected()
    }
  }, [onQueryParamDetected, openPriceCalculator, router])

  return openPriceCalculator
}
