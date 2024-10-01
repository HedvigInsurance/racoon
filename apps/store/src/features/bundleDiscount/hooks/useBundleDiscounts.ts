import { useEffect } from 'react'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { useTracking } from '@/services/Tracking/useTracking'
import { hasBundleDiscount, hasCartItemsEligibleForBundleDiscount } from '../bundleDiscount.utils'

export const useBundleDiscounts = () => {
  const tracking = useTracking()
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

  return { shouldShowBundleDiscountProducts }
}
