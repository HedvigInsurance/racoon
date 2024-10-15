'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import { Divider, yStack } from 'ui'
import { ProductCard } from '@/components/ProductCard/ProductCard'
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
            <ProductCard.Root offer={offer}>
              <ProductCard.RemoveButton />
              <ProductCard.Header />
              <ProductCard.Details
                defaultExpanded={searchParams?.get(QueryParam.ExpandCart) === '1'}
                isEditable
              />
              <ProductCard.Breakdown />
              <Divider />
              <ProductCard.TotalPrice />
            </ProductCard.Root>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
