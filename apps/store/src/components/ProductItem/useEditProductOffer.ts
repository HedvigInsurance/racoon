import { datadogLogs } from '@datadog/browser-logs'
import { useState } from 'react'
import { useAsyncRouterPush } from '@/appComponents/useAsyncRouterPush'
import { OPEN_PRICE_CALCULATOR_QUERY_PARAM } from '@/components/ProductPage/PurchaseForm/useOpenPriceCalculatorQueryParam'
import { PRELOADED_PRICE_INTENT_QUERY_PARAM } from '@/components/ProductPage/PurchaseForm/usePreloadedPriceIntentId'
import { CART_ENTRY_TO_REPLACE_QUERY_PARAM } from '@/components/ProductPage/useCartEntryToReplace'
import { useShowAppError } from '@/services/appErrors/appErrorAtom'
import type { ProductOfferFragment } from '@/services/graphql/generated'
import { Features } from '@/utils/Features'

type State = 'idle' | 'loading' | 'error'

type Params = {
  offer: ProductOfferFragment
}

export const useEditProductOffer = () => {
  const [state, setState] = useState<State>('idle')
  const showError = useShowAppError()
  const push = useAsyncRouterPush()

  const editProductOffer = async ({ offer }: Params) => {
    try {
      setState('loading')

      let targetUrl = new URL(offer.product.pageLink, window.location.origin)
      if (
        Features.enabled('PRICE_CALCULATOR_PAGE') &&
        offer.product.priceCalculatorPageLink != null
      ) {
        targetUrl = new URL(offer.product.priceCalculatorPageLink, window.location.origin)
      } else {
        targetUrl.searchParams.set(OPEN_PRICE_CALCULATOR_QUERY_PARAM, '1')
        if (offer.priceIntentId != null) {
          targetUrl.searchParams.set(PRELOADED_PRICE_INTENT_QUERY_PARAM, offer.priceIntentId)
        }
      }
      targetUrl.searchParams.set(CART_ENTRY_TO_REPLACE_QUERY_PARAM, offer.id)
      await push(targetUrl.toString())

      setState('idle')
    } catch (error) {
      setState('error')
      datadogLogs.logger.error('Error while editing product offer', {
        error,
        offerId: offer.id,
      })
      showError(error as Error)
    }
  }

  return [editProductOffer, state] as const
}
