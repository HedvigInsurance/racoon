'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useTranslation } from 'next-i18next'
import { useEffect } from 'react'
import { Text, yStack } from 'ui'
import { DiscountFieldContainer } from '@/components/ShopBreakdown/DiscountFieldContainer'
import { Divider, ShopBreakdown } from '@/components/ShopBreakdown/ShopBreakdown'
import { TotalAmountContainer } from '@/components/ShopBreakdown/TotalAmountContainer'
import {
  BUNDLE_DISCOUNT_PERCENTAGE,
  BUNDLE_DISCOUNT_PROMO_PAGE_PATH,
  hasBundleDiscount,
  hasCartItemsEligibleForBundleDiscount,
} from '@/features/bundleDiscount/bundleDiscount'
import { BundleDiscountExtraProductLinks } from '@/features/bundleDiscount/BundleDiscountExtraProductLinks'
import { readMoreLink } from '@/features/bundleDiscount/BundleDiscountSummary.css'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { useTracking } from '@/services/Tracking/useTracking'
import { QueryParam } from './CheckoutPage.constants'
import { Cartitem } from './components/CartItem/CartItem'

export function CartEntries() {
  const { t } = useTranslation('cart')
  const tracking = useTracking()
  const searchParams = useSearchParams()

  const { shopSession } = useShopSession()

  const shouldShowBundleDiscountProducts =
    shopSession &&
    // - Do not show if only accident is in the cart (confusing)
    hasCartItemsEligibleForBundleDiscount(shopSession) &&
    // - Do not show if there's a discount already (mostly not relevant anymore)
    !hasBundleDiscount(shopSession)

  const lastItem = shopSession?.cart.entries.at(-1)

  // GOTCHA: useInView did not work on initial navigation for some reason, so let's just report as effect
  useEffect(() => {
    if (shouldShowBundleDiscountProducts && lastItem != null) {
      tracking.reportViewPromotion({
        promotionId: 'bundle_discount',
        creativeName: 'BUNDLE_DISCOUNT_QUICK_LINKS',
        productId: lastItem.product.id,
        productName: lastItem.product.displayNameFull,
        productVariant: lastItem.variant.typeOfContract,
        priceAmount: lastItem.cost.net.amount,
      })
    }
  }, [shouldShowBundleDiscountProducts, tracking, lastItem])

  if (!shopSession) {
    return null
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
              <Cartitem
                offer={offer}
                defaultExpanded={searchParams?.get(QueryParam.ExpandCart) === '1'}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </ShopBreakdown>
      <DiscountFieldContainer shopSession={shopSession} />
      <Divider />
      <TotalAmountContainer cart={shopSession.cart} />

      {shouldShowBundleDiscountProducts && (
        <div className={yStack({ gap: 'md' })}>
          <BundleDiscountExtraProductLinks>
            <div>
              <Text>{t('BUNDLE_DISCOUNT_QUICK_LINKS_TITLE')}</Text>
              <Text color="textSecondary">
                {t('BUNDLE_DISCOUNT_QUICK_LINKS_SUBTITLE', {
                  percentage: BUNDLE_DISCOUNT_PERCENTAGE,
                })}{' '}
                <Link
                  href={BUNDLE_DISCOUNT_PROMO_PAGE_PATH}
                  target="_blank"
                  className={readMoreLink}
                >
                  {t('READ_MORE', { ns: 'common' })}
                </Link>
              </Text>
            </div>
          </BundleDiscountExtraProductLinks>
        </div>
      )}
    </>
  )
}
