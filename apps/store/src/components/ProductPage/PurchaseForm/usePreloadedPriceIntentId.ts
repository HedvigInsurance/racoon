import { useRouter } from 'next/router'

export const PRELOADED_PRICE_INTENT_QUERY_PARAM = 'pi_id'

export const usePreloadedPriceIntentId = () => {
  const router = useRouter()
  const { [PRELOADED_PRICE_INTENT_QUERY_PARAM]: priceIntentId } = router.query
  return typeof priceIntentId === 'string' ? priceIntentId : undefined
}
