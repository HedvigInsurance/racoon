'use client'

import { datadogLogs } from '@datadog/browser-logs'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import { ProductItem } from '@/components/ProductItemV2/ProductItem'
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

  const handleRemoveCartItem = (offer: ProductOfferFragment) => () => {
    tracking.reportDeleteFromCart(offer)
    removeCartItem({ variables: { shopSessionId: shopSession.id, offerId: offer.id } })
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
                onDelete={handleRemoveCartItem(offer)}
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
