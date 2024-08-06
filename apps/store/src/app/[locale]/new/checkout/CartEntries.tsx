'use client'

import { datadogLogs } from '@datadog/browser-logs'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import { ProductItem } from '@/components/ProductItemV2/ProductItem'
import { OPEN_PRICE_CALCULATOR_QUERY_PARAM } from '@/components/ProductPage/PurchaseForm/useOpenPriceCalculatorQueryParam'
import { PRELOADED_PRICE_INTENT_QUERY_PARAM } from '@/components/ProductPage/PurchaseForm/usePreloadedPriceIntentId'
import { CART_ENTRY_TO_REPLACE_QUERY_PARAM } from '@/components/ProductPage/useCartEntryToReplace'
import { DiscountFieldContainer } from '@/components/ShopBreakdown/DiscountFieldContainer'
import { Divider, ShopBreakdown } from '@/components/ShopBreakdown/ShopBreakdown'
import { TotalAmountContainer } from '@/components/ShopBreakdown/TotalAmountContainer'
import { useShowAppError } from '@/services/appErrors/appErrorAtom'
import {
  useCartEntryRemoveMutation,
  type ProductOfferFragment,
  type ShopSessionFragment,
} from '@/services/graphql/generated'
import { useTracking } from '@/services/Tracking/useTracking'
import { Features } from '@/utils/Features'
import { QueryParam } from './CheckoutPage.constants'

type Props = { shopSession: ShopSessionFragment }

export function CartEntries({ shopSession }: Props) {
  const tracking = useTracking()
  const showError = useShowAppError()
  const searchParams = useSearchParams()

  const [removeCartItem] = useCartEntryRemoveMutation({
    awaitRefetchQueries: true,
    onError(error) {
      datadogLogs.logger.error('Checkout Page | Failed to remove offer from cart', {
        shopSessionId: shopSession.id,
        error,
      })
      showError(error)
    },
  })

  const handleRemoveCartItem = (offer: ProductOfferFragment) => {
    tracking.reportDeleteFromCart(offer)
    removeCartItem({ variables: { shopSessionId: shopSession.id, offerId: offer.id } })
  }

  const router = useRouter()
  const handleEditCartItem = (offer: ProductOfferFragment) => {
    let targetUrl = new URL(offer.product.pageLink, window.location.origin)
    if (
      Features.enabled('PRICE_CALCULATOR_PAGE') &&
      offer.product.priceCalculatorPageLink != null
    ) {
      targetUrl = new URL(offer.product.priceCalculatorPageLink, window.location.origin)
    } else {
      targetUrl.searchParams.set(OPEN_PRICE_CALCULATOR_QUERY_PARAM, '1')
      // NOTE: Temporary code path, no need to handle this after PriceCalculatorPage is used everywhere
      if (offer.priceIntentId == null) {
        throw new Error('Expected to have offer.priceIntentId')
      }
      targetUrl.searchParams.set(PRELOADED_PRICE_INTENT_QUERY_PARAM, offer.priceIntentId)
    }
    targetUrl.searchParams.set(CART_ENTRY_TO_REPLACE_QUERY_PARAM, offer.id)

    router.push(targetUrl.toString())
  }

  return (
    <>
      <ShopBreakdown>
        <AnimatePresence initial={false}>
          {shopSession.cart.entries.map((offer) => (
            <motion.div
              key={offer.id}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0, height: 0 }}
              style={{ position: 'relative' }}
            >
              <ProductItem
                selectedOffer={offer}
                onDelete={() => handleRemoveCartItem(offer)}
                onEdit={() => handleEditCartItem(offer)}
                defaultExpanded={searchParams?.get(QueryParam.ExpandCart) === '1'}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </ShopBreakdown>
      <DiscountFieldContainer shopSession={shopSession} />
      <Divider />
      <TotalAmountContainer cart={shopSession.cart} />
    </>
  )
}
