'use client'

import { datadogLogs } from '@datadog/browser-logs'
import { motion, AnimatePresence } from 'framer-motion'
import { ProductItem } from '@/components/ProductItemV2/ProductItem'
import { ShopBreakdown } from '@/components/ShopBreakdown/ShopBreakdown'
import { useAppErrorHandleContext } from '@/services/appErrors/AppErrorContext'
import { type ProductOfferFragment, useCartEntryRemoveMutation } from '@/services/graphql/generated'
import { useShopSessionSuspense } from '@/services/shopSession/app-router/useShopSessionSuspense'
import { useTracking } from '@/services/Tracking/useTracking'
import { shopBreakdowSection } from './styles.css'

type Props = { shopSessionId: string }

export function CartEntriesSection({ shopSessionId }: Props) {
  const shopSession = useShopSessionSuspense({ shopSessionId })
  const tracking = useTracking()
  const { showError } = useAppErrorHandleContext()

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
  )
}
