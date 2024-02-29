import { useSearchParams } from 'next/navigation'

export const PRELOADED_PRICE_INTENT_QUERY_PARAM = 'pi_id'

export const usePreloadedPriceIntentId = () => {
  const searchParams = useSearchParams()
  const priceIntentId = searchParams?.get(PRELOADED_PRICE_INTENT_QUERY_PARAM)
  return typeof priceIntentId === 'string' ? priceIntentId : undefined
}
