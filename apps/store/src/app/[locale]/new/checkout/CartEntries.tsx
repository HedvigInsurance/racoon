'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import { EditActionButton } from '@/components/ProductItem/EditActionButton'
import { ProductItemContainer } from '@/components/ProductItem/ProductItemContainer'
import { RemoveActionButton } from '@/components/ProductItem/RemoveActionButton'
import { DiscountFieldContainer } from '@/components/ShopBreakdown/DiscountFieldContainer'
import { Divider, ShopBreakdown } from '@/components/ShopBreakdown/ShopBreakdown'
import { TotalAmountContainer } from '@/components/ShopBreakdown/TotalAmountContainer'
import { type ShopSessionFragment } from '@/services/graphql/generated'
import { QueryParam } from './CheckoutPage.constants'

type Props = { shopSession: ShopSessionFragment }

export function CartEntries({ shopSession }: Props) {
  const searchParams = useSearchParams()

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
              <ProductItemContainer
                offer={offer}
                defaultExpanded={searchParams?.get(QueryParam.ExpandCart) === '1'}
              >
                <EditActionButton offer={offer} />
                <RemoveActionButton
                  shopSessionId={shopSession.id}
                  offer={offer}
                  title={offer.product.displayNameFull}
                />
              </ProductItemContainer>
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
