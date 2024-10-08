'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import { yStack } from 'ui'
import { CartItem } from '@/features/CartItem/CartItem'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { QueryParam } from '../CheckoutPage.constants'

export function CartEntries() {
  const searchParams = useSearchParams()

  const { shopSession } = useShopSession()

  if (!shopSession) {
    return null
  }

  return (
    <div className={yStack({ gap: 'md' })}>
      <AnimatePresence initial={false}>
        {shopSession.cart.entries.map((offer) => (
          <motion.div
            key={offer.id}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0, height: 0 }}
            style={{ position: 'relative' }}
          >
            <CartItem
              offer={offer}
              defaultExpanded={searchParams?.get(QueryParam.ExpandCart) === '1'}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
