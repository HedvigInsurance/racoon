'use client'

import { datadogLogs } from '@datadog/browser-logs'
import { AnimatePresence, motion } from 'framer-motion'
import { ProductItem } from '@/components/ProductItemV2/ProductItem'
import { ShopBreakdown } from '@/components/ShopBreakdown/ShopBreakdown'
import { useAppErrorHandleContext } from '@/services/appErrors/AppErrorContext'
import {
  type ProductOfferFragment,
  useCartEntryRemoveMutation,
  useShopSessionSuspenseQuery,
} from '@/services/graphql/generated'
import { useTracking } from '@/services/Tracking/useTracking'
import { layout, shopBreakdowSection } from './CheckoutPage.css'

type Props = { shopSessionId: string }

export function CheckoutPage({ shopSessionId }: Props) {
  const shopSession = useShopSession({ shopSessionId })
  const tracking = useTracking()
  const { showError } = useAppErrorHandleContext()

  // TODO: add a custom merge function that makes sure to update the cache accordingly
  const [removeCartItem] = useCartEntryRemoveMutation({
    awaitRefetchQueries: true,
    onError(error) {
      datadogLogs.logger.error('Checkout Page | Failed to remove offer from cart', {
        shopSessionId: shopSession.id,
        // TODO: find a way to add offer.id here as well. Maybe from error.extraInfo
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
    <main className={layout}>
      <section className={shopBreakdowSection}>
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
                <ProductItem selectedOffer={offer} onDelete={handleRemoveCartItem(offer)} />
              </motion.div>
            ))}
          </AnimatePresence>
        </ShopBreakdown>
      </section>
    </main>
  )
}

function useShopSession({ shopSessionId }: { shopSessionId: string }) {
  // TODO: ideally we want to continue to use `useShopSession` from `ShopSessionContext` here but first we need
  // to change it so it uses React Suspense.
  const {
    data: { shopSession },
  } = useShopSessionSuspenseQuery({ variables: { shopSessionId } })

  return shopSession
}
